import React, { useState } from "react";
import { completeJourney } from "../api";
import { allStations } from "../metroData";
import Button from "../components/ui/Button";
import { Field, Select, TextInput } from "../components/ui/Field";
import { Card, Alert } from "../components/ui/Surfaces";
import { CheckIcon } from "../components/ui/Icons";

const CompleteJourney = () => {
  const [ticketToken, setTicketToken] = useState("");
  const [exitStation, setExitStation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    if (!ticketToken || !exitStation) {
      setError("Enter your ticket token and select your exit station.");
      return;
    }
    setLoading(true);
    try {
      const res = await completeJourney({ ticketToken, exitStation });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">
          Complete your journey
        </h1>
        <p className="mt-1 text-sm text-muted">
          Tap out at the gate to close out your ticket.
        </p>
      </header>

      <Card>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
            <CheckIcon className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold">Tap out</p>
        </div>

        <Field label="Ticket token">
          <TextInput
            value={ticketToken}
            onChange={(e) => setTicketToken(e.target.value)}
            placeholder="Paste your ticket token"
          />
        </Field>
        <Field label="Exit station">
          <Select
            value={exitStation}
            onChange={(e) => setExitStation(e.target.value)}
          >
            <option value="">Select station</option>
            {allStations.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>

        <Button
          variant="accent"
          className="w-full"
          onClick={handleSubmit}
          loading={loading}
        >
          {loading ? "Completing…" : "Complete journey"}
        </Button>

        <Alert type="error">{error}</Alert>
        <Alert type="success">{message}</Alert>
      </Card>
    </div>
  );
};

export default CompleteJourney;
