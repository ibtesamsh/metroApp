import React, { useState } from "react";
import { startJourney } from "../api";

const StartJourney = () => {
  const [ticketToken, setTicketToken] = useState("");
  const [source, setSource] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleStartJourney = async () => {
    try {
      const response = await startJourney({ ticketToken, source });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      setMessage("");
    }
  };

  return (
    <div className="mt-12 p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg border border-gray-300">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Start Your Journey
      </h1>

      {/* Ticket Token Input */}
      <div className="mb-4">
        <label htmlFor="ticketToken" className="block text-gray-700 mb-2">
          Ticket Token
        </label>
        <input
          type="text"
          name="ticketToken"
          id="ticketToken"
          value={ticketToken}
          onChange={(e) => setTicketToken(e.target.value)}
          placeholder="Enter your Ticket Token"
          required
          className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Source Input */}
      <div className="mb-4">
        <label htmlFor="source" className="block text-gray-700 mb-2">
          Source
        </label>
        <input
          type="text"
          name="source"
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Enter Source Station"
          required
          className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Start Journey Button */}
      <div className="mb-4">
        <button
          onClick={handleStartJourney}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
        >
          Start Journey
        </button>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <p className="text-green-600 text-center text-lg mt-4">{message}</p>
      )}
      {error && (
        <p className="text-red-600 text-center text-lg mt-4">{error}</p>
      )}
    </div>
  );
};

export default StartJourney;
