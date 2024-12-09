// import React, { useState } from "react";
// import { completeJourney } from "../api";

// const CompleteJourney = () => {
//   const [ticketToken, setTicketToken] = useState("");
//   const [exitStation, setExitStation] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleCompleteJourney = async () => {
//     try {
//       const response = await completeJourney({ ticketToken, exitStation });
//       setMessage(response.data.message);
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.message || "An error occurred.");
//       setMessage("");
//     }
//   };

//   return (
//     <div className="mt-6 flex justify-center">
//       <div className="flex min-h-full shadow-md w-2/4 flex-col justify-center px-6 py-6 lg:px-8">
//         <h1 className="text-lg font-bold text-center">Complete Journey</h1>
//         <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
//           <div>
//             <label className="block text-sm/6 font-medium text-gray-900">
//               Ticket Token
//             </label>
//             <div className="mt-1">
//               <input
//                 type="text"
//                 name="token"
//                 id="token"
//                 value={ticketToken}
//                 onChange={(e) => setTicketToken(e.target.value)}
//                 placeholder="Enter Ticket Token"
//                 required
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//           </div>

//           <div>
//             <div className="flex items-center justify-between">
//               <label className="block text-sm/6 font-medium text-gray-900">
//                 Destination
//               </label>
//             </div>
//             <div className="mt-1">
//               <input
//                 type="text"
//                 name="destination"
//                 id="destination"
//                 value={exitStation}
//                 onChange={(e) => setExitStation(e.target.value)}
//                 placeholder="Enter Destination Station"
//                 required
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//           </div>

//           <div className="mt-4">
//             <button
//               onClick={handleCompleteJourney}
//               className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//             >
//               Complete Journey
//             </button>
//             {message && <p className="mt-4 text-green-500">{message}</p>}
//             {error && <p className="mt-4 text-red-500">{error}</p>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompleteJourney;

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
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Complete Your Journey</h1>

      {/* Ticket Token Input */}
      <div className="mb-4">
        <label htmlFor="ticketToken" className="block text-gray-700 mb-2">Ticket Token</label>
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
        <label htmlFor="exitStation" className="block text-gray-700 mb-2">Exit Station</label>
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
      {message && <p className="text-green-600 text-center text-lg mt-4">{message}</p>}
      {error && <p className="text-red-600 text-center text-lg mt-4">{error}</p>}
    </div>
  );
};

export default CompleteJourney;




