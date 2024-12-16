import React, { useState } from 'react';
import { verifyTicket } from '../api.js'; // Import the verifyTicket function

const VerifyTicket = () => {
  const [ticketToken, setTicketToken] = useState('');
  const [ticket, setTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!ticketToken) {
      setErrorMessage('Please provide a ticket token.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      // Use the verifyTicket function from api.js
      const response = await verifyTicket(ticketToken);

      if (response.data.success) {
        setTicket(response.data.ticket);  // Set the ticket details if successful
      } else {
        setErrorMessage('Ticket not found.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while verifying the ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Verify Your Ticket</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ticketToken" className="block text-sm font-medium text-gray-700">Ticket Token:</label>
          <input
            type="text"
            id="ticketToken"
            value={ticketToken}
            onChange={(e) => setTicketToken(e.target.value)}
            placeholder="Enter your ticket token"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? 'Verifying...' : 'Verify Ticket'}
        </button>
      </form>

      {errorMessage && (
        <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
      )}

      {ticket && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="text-xl font-medium text-gray-800">Ticket Details</h3>
          <div className="mt-2 space-y-2">
            <p><strong className="font-semibold">Source:</strong> {ticket.source}</p>
            <p><strong className="font-semibold">Destination:</strong> {ticket.destination}</p>
            <p><strong className="font-semibold">Via:</strong> {ticket.via}</p>
            <p><strong className="font-semibold">Price:</strong> {ticket.price}rs</p>
            <p><strong className="font-semibold">Issue Date:</strong> {new Date(ticket.issuedAt).toLocaleString()}</p>
            <p><strong className="font-semibold">Ticket Expiry:</strong> {new Date(ticket.expiredAt).toLocaleString()}</p>
            <p><strong className="font-semibold">Ticket Status:</strong> {ticket.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyTicket;
