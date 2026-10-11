import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppLayout from "./pages/AppLayout";
import BookTicket from "./pages/BookTicket";
import MyTickets from "./pages/MyTickets";
import StartJourney from "./pages/StartJourney";
import CompleteJourney from "./pages/CompleteJourney";
import VerifyTicket from "./pages/VerifyTicket";
import ProtectedRoute from "./components/ProtectedRoute";

const PageWrap = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.28, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <PageWrap>
              <Login />
            </PageWrap>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrap>
              <Register />
            </PageWrap>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <PageWrap>
                <BookTicket />
              </PageWrap>
            }
          />
          <Route
            path="tickets"
            element={
              <PageWrap>
                <MyTickets />
              </PageWrap>
            }
          />
          <Route
            path="start-journey"
            element={
              <PageWrap>
                <StartJourney />
              </PageWrap>
            }
          />
          <Route
            path="complete-journey"
            element={
              <PageWrap>
                <CompleteJourney />
              </PageWrap>
            }
          />
          <Route
            path="verify-ticket"
            element={
              <PageWrap>
                <VerifyTicket />
              </PageWrap>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
