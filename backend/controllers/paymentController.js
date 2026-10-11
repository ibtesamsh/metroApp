import Razorpay from "razorpay";
import crypto from "crypto";
import { planJourney } from "../helper/metroUtils.js";
import { issueTicket } from "../helper/issueTicket.js";

// Single on/off switch for the whole payment flow. When this is not exactly
// "true", every endpoint in this file responds the same way — "payments are
// disabled, use /buy-ticket" — and the free/direct flow in
// ticketController.js is what handles bookings instead.
export const isRazorpayEnabled = () => process.env.RAZORPAY_PAYMENT === "true";

// Lazily constructed so the app doesn't crash on boot if RAZORPAY_PAYMENT is
// "false" and the key env vars are simply unset.
let razorpayInstance = null;
const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set.");
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// Public-ish (still behind authToken) — tells the frontend which flow to
// render and hands over the publishable key_id only. key_secret never
// leaves the server.
export const getPaymentConfig = (_req, res) => {
  const enabled = isRazorpayEnabled();
  return res.status(200).json({
    success: true,
    razorpayEnabled: enabled,
    razorpayKeyId: enabled ? process.env.RAZORPAY_KEY_ID : null,
  });
};

export const createPaymentOrder = async (req, res) => {
  if (!isRazorpayEnabled()) {
    return res.status(400).json({
      success: false,
      message: "Razorpay payments are disabled. Call /buy-ticket to book directly.",
    });
  }

  const { source, destination } = req.body;
  if (!source || !destination) {
    return res.status(400).json({ success: false, message: "Source and destination are required." });
  }
  if (source === destination) {
    return res.status(400).json({ success: false, message: "Source and destination cannot be the same." });
  }

  const plan = planJourney(source, destination);
  if (!plan) {
    return res.status(400).json({
      success: false,
      message: "No valid route exists between the selected stations.",
    });
  }

  try {
    const instance = getRazorpayInstance();
    const order = await instance.orders.create({
      // Razorpay expects the smallest currency unit (paise for INR).
      amount: plan.price * 100,
      currency: "INR",
      receipt: `metro_${Date.now()}`,
      notes: { source, destination, userId: String(req.user._id) },
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      source,
      destination,
      price: plan.price,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating Razorpay order.",
      error: error.message,
    });
  }
};

export const verifyPaymentAndBook = async (req, res) => {
  if (!isRazorpayEnabled()) {
    return res.status(400).json({ success: false, message: "Razorpay payments are disabled." });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    source,
    destination,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !source || !destination) {
    return res.status(400).json({ success: false, message: "Missing payment verification fields." });
  }

  // This is the step that actually matters: never trust the client's say-so
  // that a payment succeeded. Recompute the signature server-side from the
  // secret key and compare.
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const signaturesMatch =
    expectedSignature.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature));

  if (!signaturesMatch) {
    return res.status(400).json({ success: false, message: "Payment verification failed." });
  }

  try {
    const { ticket, error } = await issueTicket({
      userId: req.user._id,
      source,
      destination,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    if (error) {
      // The signature was valid but the route/stations were bad — this
      // shouldn't normally happen since createPaymentOrder already
      // validated it, but stations data could change between the two calls.
      return res.status(error.status).json({ success: false, message: error.message });
    }

    return res.status(201).json({
      success: true,
      message: "Payment verified and ticket booked successfully.",
      ticket,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Payment was verified but booking the ticket failed. Contact support with your payment ID.",
      razorpayPaymentId: razorpay_payment_id,
      error: err.message,
    });
  }
};
