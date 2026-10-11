import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  buyTicket,
  getPaymentConfig,
  createPaymentOrder,
  verifyPayment,
} from "../api";
import { loadRazorpayScript } from "../razorpay";
import { allStations } from "../metroData";
import { areConnected } from "../metroGraph";
import Button from "../components/ui/Button";
import { Field, Select } from "../components/ui/Field";
import { Card, Alert, SkeletonCard } from "../components/ui/Surfaces";
import { TicketIcon } from "../components/ui/Icons";
import MetroMap from "../components/ui/MetroMap";

const Confetti = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {Array.from({ length: 26 }).map((_, i) => (
      <motion.span
        key={i}
        initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
        animate={{
          y: 320,
          x: (Math.random() - 0.5) * 240,
          rotate: Math.random() * 360,
          opacity: 0,
        }}
        transition={{ duration: 1.2 + Math.random() * 0.8, ease: "easeOut" }}
        className="absolute left-1/2 top-0 block h-2 w-2 rounded-sm"
        style={{
          backgroundColor: ["#f97316", "#0d9488", "#22c55e", "#facc15"][i % 4],
        }}
      />
    ))}
  </div>
);

const BookTicket = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getPaymentConfig()
      .then((res) => setPaymentConfig(res.data))
      .catch(() =>
        setPaymentConfig({ razorpayEnabled: false, razorpayKeyId: null }),
      );
  }, []);

  const handleSetSource = (station) => {
    setSource(station);
    setError("");
    if (station && destination && !areConnected(station, destination))
      setDestination("");
  };
  const handleSetDestination = (station) => {
    setDestination(station);
    setError("");
  };
  const resetSelection = () => {
    setSource("");
    setDestination("");
  };

  const celebrateSuccess = (msg) => {
    setSuccess(msg);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 1600);
  };

  const bookDirectly = async () => {
    const response = await buyTicket({ source, destination });
    const { ticketToken, price } = response.data.ticket;
    celebrateSuccess(`Ticket purchased for ₹${price}. Token: ${ticketToken}`);
    resetSelection();
  };

  const bookWithRazorpay = async () => {
    const orderRes = await createPaymentOrder({ source, destination });
    const { orderId, amount, currency, keyId, price } = orderRes.data;

    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      setError(
        "Couldn't load the payment window. Check your connection and try again.",
      );
      return;
    }

    setLoading(false);
    const checkout = new window.Razorpay({
      key: keyId,
      amount,
      currency,
      order_id: orderId,
      name: "Metro Ticketing",
      description: `${source} → ${destination} (₹${price})`,
      theme: { color: "#0d9488" },
      handler: async (response) => {
        setError("");                   
        setSuccess("");                
        setLoading(true);
        try {
          const verifyRes = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            source,
            destination,
          });
          const { ticketToken, price: finalPrice } = verifyRes.data.ticket;
          celebrateSuccess(
            `Payment successful — ticket purchased for ₹${finalPrice}. Token: ${ticketToken}`,
          );
          resetSelection();
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "Payment went through but booking failed — contact support with your payment ID.",
          );
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setLoading(false);  
          setError("Payment window closed before completing payment.");
        }
      },
    });

    checkout.on("payment.failed", (resp) => {
      setError(resp.error?.description || "Payment failed. Please try again.");
      setSuccess("");
    });

    setError("");                    
    setSuccess(""); 
    checkout.open();
  };

  const handlePurchase = async () => {
    setError("");
    setSuccess("");
    if (!source || !destination) {
      setError(
        "Please select both a source and a destination — tap two stations on the map, or use the dropdowns below.",
      );
      return;
    }
    if (source === destination) {
      setError("Source and destination cannot be the same.");
      return;
    }

    setLoading(true);
    try {
      if (paymentConfig?.razorpayEnabled) await bookWithRazorpay();
      else await bookDirectly();
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong while booking.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold md:text-3xl">Book a ticket</h1>
        <p className="mt-1 text-sm text-muted">
          Tap two stations on the map below — reachable ones stay highlighted.
        </p>
      </header>

      {paymentConfig === null ? (
        <SkeletonCard />
      ) : (
        <Card>
          <MetroMap
            source={source}
            destination={destination}
            onSelectSource={handleSetSource}
            onSelectDestination={handleSetDestination}
          />
        </Card>
      )}

      <Card className="relative overflow-hidden">
        <AnimatePresence>{celebrate && <Confetti />}</AnimatePresence>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <TicketIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Confirm your journey</p>
            <p className="text-xs text-muted">
              ₹10 per station travelled
              {paymentConfig?.razorpayEnabled && " · paid via Razorpay"}
            </p>
          </div>
        </div>

        <Field label="From">
          <Select
            value={source}
            onChange={(e) => handleSetSource(e.target.value)}
          >
            <option value="">Select source station</option>
            {allStations.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="To">
          <Select
            value={destination}
            onChange={(e) => handleSetDestination(e.target.value)}
          >
            <option value="">Select destination station</option>
            {allStations
              .filter(
                (s) => !source || s === destination || areConnected(source, s),
              )
              .map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </Select>
        </Field>

        <Button
          variant="accent"
          className="w-full"
          onClick={handlePurchase}
          loading={loading}
        >
          {loading
            ? paymentConfig?.razorpayEnabled
              ? "Preparing payment…"
              : "Booking…"
            : paymentConfig?.razorpayEnabled
              ? "Pay & book ticket"
              : "Buy ticket"}
        </Button>

        <Alert type="error">{error}</Alert>
        <Alert type="success">
          {success && (
            <div className="flex items-center justify-between gap-3">
              <span>{success}</span>
              <button
                onClick={() => navigate("/tickets")}
                className="shrink-0 font-semibold underline underline-offset-2"
              >
                View tickets
              </button>
            </div>
          )}
        </Alert>
      </Card>
    </div>
  );
};

export default BookTicket;
