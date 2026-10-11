import { Ticket } from "../models/ticket.model.js";
import { redis } from "../server.js";
import { issueTicket } from "../helper/issueTicket.js";
import { isRazorpayEnabled } from "./paymentController.js";

const CACHE_TTL_SECONDS = 60;

const invalidateAndCacheUserTickets = async (userId) => {
  const tickets = await Ticket.find({ userId }).sort({ issuedAt: -1 });
  await redis.setex(`tickets:${userId}`, CACHE_TTL_SECONDS, JSON.stringify(tickets));
  return tickets;
};

// Free/direct booking path — only usable when RAZORPAY_PAYMENT is not
// "true". When Razorpay is enabled this is intentionally refused, so a user
// can't skip payment by just calling this endpoint directly; booking then
// only happens via paymentController.verifyPaymentAndBook after a verified
// payment.
export const buyTicket = async (req, res) => {
  if (isRazorpayEnabled()) {
    return res.status(400).json({
      success: false,
      message: "Direct booking is disabled while Razorpay payments are enabled. Use /payment/create-order.",
    });
  }

  const { source, destination } = req.body;

  try {
    const { ticket, error } = await issueTicket({ userId: req.user._id, source, destination });
    if (error) {
      return res.status(error.status).json({ success: false, message: error.message });
    }

    return res.status(201).json({
      success: true,
      message: "Ticket purchased successfully.",
      ticket,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error purchasing ticket.", error: error.message });
  }
};

export const getMyTickets = async (req, res) => {
  const userId = req.user._id;

  try {
    const cached = await redis.get(`tickets:${userId}`);
    if (cached) {
      return res.status(200).json({ success: true, tickets: JSON.parse(cached), source: "cache" });
    }

    const tickets = await invalidateAndCacheUserTickets(userId);
    return res.status(200).json({ success: true, tickets, source: "db" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const verifyTicket = async (req, res) => {
  const { ticketToken } = req.body;

  if (!ticketToken) {
    return res.status(400).json({ success: false, message: "ticketToken is required." });
  }

  try {
    const ticket = await Ticket.findOne({ ticketToken });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found." });
    }
    if (String(ticket.userId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "This ticket does not belong to you." });
    }
    return res.status(200).json({ success: true, ticket });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Called on an interval from server.js rather than self-scheduling here,
// so it only ever runs once no matter how this module gets imported.
export const expireStaleTickets = async () => {
  try {
    const result = await Ticket.updateMany(
      { expiredAt: { $lte: new Date() }, status: "Active" },
      { $set: { status: "Expired" } },
    );
    if (result.modifiedCount > 0) {
      console.log(`Expired ${result.modifiedCount} ticket(s).`);
    }
  } catch (error) {
    console.error("Error expiring tickets:", error.message);
  }
};
