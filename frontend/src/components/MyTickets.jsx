import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQrcode from "react-qr-code";
import html2canvas from "html2canvas"; // Import html2canvas
import { jsPDF } from "jspdf"; // Import jsPDF

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/my-ticket",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.tickets) {
          setTickets(response.data.tickets);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch tickets");
      }
    };

    fetchTickets();
  }, [navigate]);

  const downloadTicketPDF = (ticketToken) => {
    const ticketElement = document.getElementById(ticketToken);
    if (ticketElement) {
      html2canvas(ticketElement, {
        scale: 1,
        useCORS: true,
        ignoreElements: (element) =>
          element.classList.contains("download-pdf-button"),
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const doc = new jsPDF({
          unit: "mm",
          format: "a4",
        });

        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

        doc.save(`${ticketToken}.pdf`);
      });
    }
  };

  return (
    
    <div className="p-6 max-w-4xl mx-auto  rounded-xl">
      <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
        My Booked Tickets
      </h1>

      {tickets.length === 0 ? (
        <p className="text-center text-gray-500">You have no booked tickets.</p>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div
              id={ticket.ticketToken}
              key={ticket.ticketToken}
              className="flex flex-col sm:flex-row justify-between items-center p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {/* Ticket Details */}
              <div className="flex flex-col space-y-2 w-full sm:w-2/3">
                <h2 className="text-xl font-medium text-gray-800">
                  {ticket.source} → {ticket.destination}
                </h2>
                <p className="text-gray-600">Via: {ticket.via}</p>
                <p className="text-gray-600">Price: ₹{ticket.price}</p>
                <p className="text-gray-500">
                  Ticket Token:{" "}
                  <span className="font-medium text-indigo-600">
                    {ticket.ticketToken}
                  </span>
                </p>
                <p className="text-gray-500">Status: {ticket.status}</p>
                <p className="text-sm text-gray-400">
                  Issued Time: {new Date(ticket.issuedAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">
                  Expiry Time: {new Date(ticket.expiredAt).toLocaleString()}
                </p>
              </div>

              {/* QR Code */}
              <div className="w-32 h-32 flex justify-center items-center bg-white border border-gray-300 rounded-md shadow-md mt-4 sm:mt-0">
                <ReactQrcode
                  className="w-full h-full"
                  value={JSON.stringify(ticket)}
                />
              </div>

              {/* Download PDF Button */}
              <button
                onClick={() => downloadTicketPDF(ticket.ticketToken)}
                className="download-pdf-button mt-4 sm:mt-0 sm:ml-6 w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                Download Ticket as PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    
  );
};

export default MyTickets;






