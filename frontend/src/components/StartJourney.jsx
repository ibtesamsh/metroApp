// import React, { useState } from "react";
// import { startJourney } from "../api";

// const StartJourney = () => {
//   const [ticketToken, setTicketToken] = useState("");
//   const [source, setSource] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleStartJourney = async () => {
//     try {
//       const response = await startJourney({ ticketToken, source });
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
//         <h1 className="text-lg font-bold text-center">Start Journey</h1>
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
//                 Source
//               </label>
//             </div>
//             <div className="mt-1">
//               <input
//                 type="text"
//                 name="source"
//                 id="source"
//                 value={source}
//                 onChange={(e) => setSource(e.target.value)}
//                 placeholder="Enter Source Station"
//                 required
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//           </div>

//           <div className="mt-2">
//             <button
//               onClick={handleStartJourney}
//               className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//             >
//               Start Journey
//             </button>
//             {message && <p className="mt-4 text-green-500">{message}</p>}
//             {error && <p className="mt-4 text-red-500">{error}</p>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StartJourney;


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
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Start Your Journey</h1>

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

      {/* Source Input */}
      <div className="mb-4">
        <label htmlFor="source" className="block text-gray-700 mb-2">Source</label>
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
      {message && <p className="text-green-600 text-center text-lg mt-4">{message}</p>}
      {error && <p className="text-red-600 text-center text-lg mt-4">{error}</p>}
    </div>
  );
};

export default StartJourney;

