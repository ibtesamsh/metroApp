// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import ReactQrcode from "react-qr-code";
// // import { initiatePayment } from '../api';
// const MyTickets = () => {
//   const [tickets, setTickets] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const response = await axios.get(
//           "http://localhost:3000/api/my-ticket",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log(response);
//         if (response.data.tickets) {
//           setTickets(response.data.tickets);
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to fetch tickets");
//       }
//     };

//     fetchTickets();
//   }, [navigate]);

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6 text-center">My Booked Tickets</h1>

//       {tickets.length === 0 ? (
//         <p className="text-center text-gray-500">You have no booked tickets.</p>
//       ) : (
//         <div>
//           {tickets.map((ticket) => (
//             <div
//               key={ticket.ticketToken}
//               className="flex mb-4 p-4 border-l-4 border-indigo-400 bg-gray-100 rounded-lg shadow-sm"
//             >
//               <h2 className="text-lg font-semibold">
//                 {ticket.source} → {ticket.destination}
//               </h2>
//               <div key={ticket.ticketToken}>
//                 <p className="text-gray-600">Price: ₹{ticket.price}</p>
//                 <p className="text-gray-500">
//                   Ticket Token: {ticket.ticketToken}
//                 </p>
//                 <p className="text-gray-500">Status: {ticket.status}</p>
//                 <p className="text-sm text-gray-400">
//                   Issued Time: {new Date(ticket.issuedAt).toLocaleTimeString()}
//                 </p>
//                 <p className="text-sm text-gray-400">
//                   Expire Time: {new Date(ticket.expiredAt).toLocaleTimeString()}
//                 </p>
//               </div>
//               <div className="">
//                 <p>
//                   <ReactQrcode
//                     className="size-40"
//                     value={JSON.stringify(ticket)}
//                   />
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyTickets;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQrcode from "react-qr-code";

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
          "http://localhost:3000/api/my-ticket",
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

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
        My Booked Tickets
      </h1>

      {tickets.length === 0 ? (
        <p className="text-center text-gray-500">You have no booked tickets.</p>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.ticketToken}
              className="flex justify-between items-center p-6 border-l-4 border-indigo-500 bg-gray-50 rounded-lg shadow-md"
            >
              <div className="flex flex-col space-y-2 w-2/3">
                <h2 className="text-xl font-semibold text-gray-800">
                  {ticket.source} → {ticket.destination}
                </h2>
                <p className="text-gray-600">Price: ₹{ticket.price}</p>
                <p className="text-gray-500">
                  Ticket Token: <span className="font-medium">{ticket.ticketToken}</span>
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
              <div className="w-32 h-32 flex justify-center items-center bg-white border border-gray-300 rounded-md shadow-md p-2">
                <ReactQrcode
                  className="w-full h-full"
                  value={JSON.stringify(ticket)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
