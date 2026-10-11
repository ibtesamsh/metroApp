import React, { useState } from "react";
import { startJourney } from "../api";
import { allStations } from "../metroData";
import Button from "../components/ui/Button";
import { Field, Select, TextInput } from "../components/ui/Field";
import { Card, Alert } from "../components/ui/Surfaces";
import { PlayIcon } from "../components/ui/Icons";

const StartJourney = () => {
  const [ticketToken, setTicketToken] = useState("");
  const [source, setSource] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    if (!ticketToken || !source) {
      setError(
        "Enter your ticket token and select where you're starting from.",
      );
      return;
    }
    setLoading(true);
    try {
      const res = await startJourney({ ticketToken, source });
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
        <h1 className="text-2xl font-bold md:text-3xl">Start your journey</h1>
        <p className="mt-1 text-sm text-muted">
          Tap in at the gate with your ticket token.
        </p>
      </header>

      <Card>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <PlayIcon className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold">Tap in</p>
        </div>

        <Field label="Ticket token">
          <TextInput
            value={ticketToken}
            onChange={(e) => setTicketToken(e.target.value)}
            placeholder="Paste your ticket token"
          />
        </Field>

        <Field label="Starting station">
          <Select value={source} onChange={(e) => setSource(e.target.value)}>
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
          {loading ? "Starting…" : "Start journey"}
        </Button>

        <Alert type="error">{error}</Alert>
        <Alert type="success">{message}</Alert>
      </Card>
    </div>
  );
};

export default StartJourney;
