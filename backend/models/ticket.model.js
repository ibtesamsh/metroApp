import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  ticketToken: {
    type: String,
    required: true,
    unique: true,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  via: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Expired", "In Journey", "Completed"],
    default: "Active",
  },
  // Only populated when the ticket was booked through Razorpay
  // (RAZORPAY_PAYMENT=true). Both stay undefined on the free/direct flow.
  razorpayOrderId: {
    type: String,
    default: null,
  },
  razorpayPaymentId: {
    type: String,
    default: null,
  },
});

export const Ticket = mongoose.model("Ticket", ticketSchema);
