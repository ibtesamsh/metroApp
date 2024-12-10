import React, { useState } from "react";
import { completeJourney } from "../api";

const CompleteJourney = () => {
  const [ticketToken, setTicketToken] = useState("");
  const [exitStation, setExitStation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCompleteJourney = async () => {
    try {
      const response = await completeJourney({ ticketToken, exitStation });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      setMessage("");
    }
  };

  return (
    <div className="mt-6 p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg border border-gray-300">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Complete Your Journey
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

      {/* Exit Station Input */}
      <div className="mb-4">
        <label htmlFor="exitStation" className="block text-gray-700 mb-2">
          Exit Station
        </label>
        <input
          type="text"
          name="exitStation"
          id="exitStation"
          value={exitStation}
          onChange={(e) => setExitStation(e.target.value)}
          placeholder="Enter Exit Station"
          required
          className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Complete Journey Button */}
      <div className="mb-4">
        <button
          onClick={handleCompleteJourney}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
        >
          Complete Journey
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

export default CompleteJourney;
