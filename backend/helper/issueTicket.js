import { v4 as uuidv4 } from "uuid";
import { Ticket } from "../models/ticket.model.js";
import { planJourney } from "./metroUtils.js";
import { redis } from "../server.js";

const TICKET_VALID_MS = 60 * 60 * 1000; // 1 hour
const CACHE_TTL_SECONDS = 60;

/**
 * Validates the route and writes a new ticket. Used by both the free/direct
 * booking flow and the post-payment Razorpay flow so the two never drift
 * out of sync with each other.
 *
 * Returns { ticket } on success, or { error: { status, message } } on
 * failure — callers map that straight onto their response.
 */
export const issueTicket = async ({
  userId,
  source,
  destination,
  razorpayOrderId = null,
  razorpayPaymentId = null,
}) => {
  if (!source || !destination) {
    return { error: { status: 400, message: "Source and destination are required." } };
  }
  if (source === destination) {
    return { error: { status: 400, message: "Source and destination cannot be the same." } };
  }

  const plan = planJourney(source, destination);
  if (!plan) {
    return {
      error: { status: 400, message: "No valid route exists between the selected stations." },
    };
  }

  const ticket = new Ticket({
    userId,
    ticketToken: uuidv4(),
    source,
    destination,
    via: plan.via,
    price: plan.price,
    issuedAt: new Date(),
    expiredAt: new Date(Date.now() + TICKET_VALID_MS),
    razorpayOrderId,
    razorpayPaymentId,
  });

  await ticket.save();

  // Keep the tickets cache consistent with what buy/list endpoints expect.
  const tickets = await Ticket.find({ userId }).sort({ issuedAt: -1 });
  await redis.setex(`tickets:${userId}`, CACHE_TTL_SECONDS, JSON.stringify(tickets));

  return { ticket, plan };
};
