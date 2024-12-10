import axios from "axios";

export const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const registerUser = (userData) => api.post("/register", userData);
export const loginUser = (userData) => api.post("/login", userData);
export const logoutUser = (userData) => api.post("/logout", userData);

export const initiatePayment = (paymentData) =>
  api.post("/buy-ticket", paymentData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const startJourney = (journey) => api.post("/start-journey", journey);
export const completeJourney = (journey) =>
  api.post("/complete-journey", journey);

export const verifyTicket = (ticketToken) =>
    api.post("/verify-ticket", { ticketToken });