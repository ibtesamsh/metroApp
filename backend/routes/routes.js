import express from "express";
import authToken from "../middleware/authToken.js";
import { register, login, logout } from "../controllers/authController.js";
import { buyTicket, getMyTickets, verifyTicket } from "../controllers/ticketController.js";
import { startJourney, completeJourney } from "../controllers/journeyController.js";
import {
  getPaymentConfig,
  createPaymentOrder,
  verifyPaymentAndBook,
} from "../controllers/paymentController.js";

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authToken, logout);

// Tickets — buyTicket is the free/direct path, only active when
// RAZORPAY_PAYMENT is not "true" (see ticketController.js).
router.post("/buy-ticket", authToken, buyTicket);
router.get("/my-tickets", authToken, getMyTickets);
router.post("/verify-ticket", authToken, verifyTicket);

// Payment — only functional when RAZORPAY_PAYMENT=true (see paymentController.js).
router.get("/payment-config", authToken, getPaymentConfig);
router.post("/payment/create-order", authToken, createPaymentOrder);
router.post("/payment/verify", authToken, verifyPaymentAndBook);

// Journey
router.post("/start-journey", authToken, startJourney);
router.post("/complete-journey", authToken, completeJourney);

export default router;
