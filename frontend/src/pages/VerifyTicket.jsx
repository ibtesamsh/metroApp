import React, { useState } from "react";
import { verifyTicket } from "../api";
import Button from "../components/ui/Button";
import { Field, TextInput } from "../components/ui/Field";
import { Card, Alert, StatusBadge } from "../components/ui/Surfaces";
import { SearchIcon } from "../components/ui/Icons";

const VerifyTicket = () => {
  const [ticketToken, setTicketToken] = useState("");
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTicket(null);
    if (!ticketToken) {
      setError("Please provide a ticket token.");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyTicket(ticketToken);
      if (res.data.success) setTicket(res.data.ticket);
      else setError("Ticket not found.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while verifying the ticket.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Verify a ticket</h1>
        <p className="mt-1 text-sm text-muted">
          Look up the status and details of any of your tickets.
        </p>
      </header>

      <Card>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <SearchIcon className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold">Lookup</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Field label="Ticket token">
            <TextInput
              value={ticketToken}
              onChange={(e) => setTicketToken(e.target.value)}
              placeholder="Enter your ticket token"
              required
            />
          </Field>
          <Button
            type="submit"
            variant="accent"
            className="w-full"
            loading={loading}
          >
            {loading ? "Verifying…" : "Verify ticket"}
          </Button>
        </form>

        <Alert type="error">{error}</Alert>

        {ticket && (
          <div className="mt-6 rounded-xl border border-border bg-surface-2 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {ticket.source} <span className="text-muted">→</span>{" "}
                {ticket.destination}
              </h3>
              <StatusBadge status={ticket.status} />
            </div>
            <dl className="space-y-1.5 text-sm">
              {ticket.via?.length > 0 && (
                <div className="flex justify-between text-muted">
                  <dt>Via</dt>
                  <dd className="text-text">{ticket.via.join(", ")}</dd>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <dt>Price</dt>
                <dd className="text-text">₹{ticket.price}</dd>
              </div>
              <div className="flex justify-between text-muted">
                <dt>Issued</dt>
                <dd className="text-text">
                  {new Date(ticket.issuedAt).toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between text-muted">
                <dt>Expires</dt>
                <dd className="text-text">
                  {new Date(ticket.expiredAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VerifyTicket;
