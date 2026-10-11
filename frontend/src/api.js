import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is invalid/expired, clear it and bounce to login instead of
// leaving the app stuck showing stale "authenticated" UI.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;

export const registerUser = (data) => api.post("/register", data);
export const loginUser = (data) => api.post("/login", data);
export const logoutUser = () => api.post("/logout");

export const buyTicket = (data) => api.post("/buy-ticket", data);
export const getMyTickets = () => api.get("/my-tickets");
export const verifyTicket = (ticketToken) => api.post("/verify-ticket", { ticketToken });

// Payment (Razorpay) — getPaymentConfig tells the UI whether to use these
// at all; when RAZORPAY_PAYMENT=false on the backend these 400 and the app
// should fall back to buyTicket() above instead.
export const getPaymentConfig = () => api.get("/payment-config");
export const createPaymentOrder = (data) => api.post("/payment/create-order", data);
export const verifyPayment = (data) => api.post("/payment/verify", data);

export const startJourney = (data) => api.post("/start-journey", data);
export const completeJourney = (data) => api.post("/complete-journey", data);
