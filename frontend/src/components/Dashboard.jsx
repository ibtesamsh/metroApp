import React, { useState, useEffect } from "react";
import { initiatePayment } from "../api.js"; // API call

const metroData = {
  "lines": [
    {
      "line": "Line-1",
      "name": "Versova-Andheri-Ghatkopar",
      "stations": ["Versova", "DN Nagar", "Azad Nagar", "Andheri", "Western Express Highway", "Chakala (JB Nagar)", "Marol Naka", "Saki Naka", "Asalpha", "Jagruti Nagar", "Ghatkopar"]
    },
    {
      "line": "Line-2A",
      "name": "Dahisar East-DN Nagar",
      "stations": ["Dahisar East", "Anand Nagar", "Kandarpada", "Kandivali West", "Shimpoli", "Borivali West", "Shivaji Nagar", "Link Road Goregaon West", "DN Nagar"]
    },
    {
      "line": "Line-2B",
      "name": "DN Nagar-Bandra-Mankhurd",
      "stations": ["DN Nagar", "Juhu Circle", "Santacruz West", "Bandra West", "Kalanagar", "Bandra Kurla Complex", "Kurla East", "Chembur", "Mankhurd"]
    },
    {
      "line": "Line-4",
      "name": "Wadala-Kasarvadavali",
      "stations": ["Wadala", "Bhakti Park", "Amar Mahal", "Ghatkopar", "Mulund", "Teen Hath Naka", "Kasarvadavali"]
    },
    {
      "line": "Line-5",
      "name": "Thane-Bhiwandi-Kalyan",
      "stations": ["Thane", "Bhiwandi", "Kalyan"]
    },
    {
      "line": "Line-6",
      "name": "Swami Samarth Nagar-Vikhroli",
      "stations": ["Swami Samarth Nagar", "Jogeshwari", "SEEPZ", "Powai", "Vikhroli"]
    },
    {
      "line": "Line-7",
      "name": "Dahisar East-Gundavali",
      "stations": ["Dahisar East", "Kandarpada", "Borivali East", "Magathane", "Poinsur", "Gundavali"]
    },
    {
      "line": "Line-9 & 7A",
      "name": "Dahisar East-Mira Bhayandar and Andheri East-CSMIA",
      "stations": ["Dahisar East", "Mira Road", "Bhayandar", "Andheri East", "CSMIA"]
    }
  ],
  "features": {
    "viaRoutes": true
  }
}

const Dashboard = () => {
  const [selectedLine, setSelectedLine] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [price, setPrice] = useState(0);
  const [stations, setStations] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
    if (selectedLine) {
      const lineData = metroData.lines.find((line) => line.line === selectedLine);
      setStations(lineData ? lineData.stations : []);
    } else {
      setStations([]);
    }
  }, [selectedLine]);

  const calculatePrice = () => {
    const sourceIndex = stations.indexOf(source);
    const destinationIndex = stations.indexOf(destination);

    if (sourceIndex !== -1 && destinationIndex !== -1) {
      const distance = Math.abs(destinationIndex - sourceIndex);
      setPrice(distance * 10); // ₹10 per station
      setError("");
    } else {
      setPrice(0);
      setError("Please select valid source and destination stations.");
    }
  };

  const handlePayment = async () => {
    if (!source || !destination || price === 0) {
      setError("Complete all fields and calculate the price before proceeding.");
      return;
    }
    try {
      const paymentData = { source, destination, price };
      const response = await initiatePayment(paymentData);
      setSuccess(`Payment successful! Ticket Token: ${response.data.ticket.ticketToken}`);
      setError("");
      setSelectedLine("");
      setSource("");
      setDestination("");
      setPrice(0);
    } catch (err) {
      setError("An error occurred during payment. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="mt-6 p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Book Tickets</h1>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Line:</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={selectedLine}
          onChange={(e) => setSelectedLine(e.target.value)}
        >
          <option value="">Select Line</option>
          {metroData.lines.map((line) => (
            <option key={line.line} value={line.line}>
              {line.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Source:</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          disabled={!stations.length}
        >
          <option value="">Select Source</option>
          {stations.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Destination:</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          disabled={!stations.length}
        >
          <option value="">Select Destination</option>
          {stations.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>
      </div>

      <button
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mb-4"
        onClick={calculatePrice}
      >
        Calculate Price
      </button>

      {price > 0 && <p className="text-xl text-green-600 mb-4">Price: ₹{price}</p>}

      <button
        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
        onClick={handlePayment}
      >
        Proceed to Payment
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {success && <p className="mt-4 text-green-500">{success}</p>}
    </div>
  );
};

export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { initiatePayment } from "../api.js"; // API call

// const metroData = {
//   lines: [
//     {
//       line: "Line-1",
//       name: "Versova-Andheri-Ghatkopar",
//       stations: [
//         "Versova",
//         "DN Nagar",
//         "Azad Nagar",
//         "Andheri",
//         "Western Express Highway",
//         "Chakala (JB Nagar)",
//         "Marol Naka",
//         "Saki Naka",
//         "Asalpha",
//         "Jagruti Nagar",
//         "Ghatkopar",
//       ],
//     },
//     {
//       line: "Line-2A",
//       name: "Dahisar East-DN Nagar",
//       stations: [
//         "Dahisar East",
//         "Anand Nagar",
//         "Kandarpada",
//         "Kandivali West",
//         "Shimpoli",
//         "Borivali West",
//         "Shivaji Nagar",
//         "Link Road Goregaon West",
//         "DN Nagar",
//       ],
//     },
//     {
//       line: "Line-2B",
//       name: "DN Nagar-Bandra-Mankhurd",
//       stations: [
//         "DN Nagar",
//         "Juhu Circle",
//         "Santacruz West",
//         "Bandra West",
//         "Kalanagar",
//         "Bandra Kurla Complex",
//         "Kurla East",
//         "Chembur",
//         "Mankhurd",
//       ],
//     },
//     {
//       line: "Line-4",
//       name: "Wadala-Kasarvadavali",
//       stations: [
//         "Wadala",
//         "Bhakti Park",
//         "Amar Mahal",
//         "Ghatkopar",
//         "Mulund",
//         "Teen Hath Naka",
//         "Kasarvadavali",
//       ],
//     },
//     {
//       line: "Line-5",
//       name: "Thane-Bhiwandi-Kalyan",
//       stations: ["Thane", "Bhiwandi", "Kalyan"],
//     },
//     {
//       line: "Line-6",
//       name: "Swami Samarth Nagar-Vikhroli",
//       stations: [
//         "Swami Samarth Nagar",
//         "Jogeshwari",
//         "SEEPZ",
//         "Powai",
//         "Vikhroli",
//       ],
//     },
//     {
//       line: "Line-7",
//       name: "Dahisar East-Gundavali",
//       stations: [
//         "Dahisar East",
//         "Kandarpada",
//         "Borivali East",
//         "Magathane",
//         "Poinsur",
//         "Gundavali",
//       ],
//     },
//     {
//       line: "Line-9 & 7A",
//       name: "Dahisar East-Mira Bhayandar and Andheri East-CSMIA",
//       stations: [
//         "Dahisar East",
//         "Mira Road",
//         "Bhayandar",
//         "Andheri East",
//         "CSMIA",
//       ],
//     },
//   ],
//   features: {
//     viaRoutes: true,
//   },
// };

// const Dashboard = () => {
//   const [source, setSource] = useState("");
//   const [destination, setDestination] = useState("");
//   const [price, setPrice] = useState(0);
//   const [stations, setStations] = useState([]);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token) {
//       window.location.href = "/login";
//     }
//     const allStations = metroData.lines.reduce((acc, line) => {
//       return acc.concat(line.stations);
//     }, []);
//     setStations([...new Set(allStations)]);
//   }, []);

//   const calculatePrice = () => {
//     const sourceIndex = stations.indexOf(source);
//     const destinationIndex = stations.indexOf(destination);

//     if (sourceIndex !== -1 && destinationIndex !== -1) {
//       const distance = Math.abs(destinationIndex - sourceIndex);
//       setPrice(distance * 10);
//       setError("");
//     } else {
//       setPrice(0);
//       setError("Please select valid source and destination stations.");
//     }
//   };

//   const handlePayment = async () => {
//     if (!source || !destination || price === 0) {
//       setError(
//         "Complete all fields and calculate the price before proceeding."
//       );
//       return;
//     }
//     try {
//       const paymentData = { source, destination, price };
//       const response = await initiatePayment(paymentData);
//       setSuccess(
//         `Payment successful! Ticket Token: ${response.data.ticket.ticketToken}`
//       );
//       setError("");
//       setSource("");
//       setDestination("");
//       setPrice(0);
//     } catch (err) {
//       setError("An error occurred during payment. Please try again.");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="mt-6 p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
//       <h1 className="text-2xl font-bold mb-6 text-center">Book Tickets</h1>

//       {/* Removed the Select Line dropdown */}

//       <div className="mb-4">
//         <label className="block text-gray-700 mb-2">Select Source:</label>
//         <select
//           className="w-full border border-gray-300 rounded px-3 py-2"
//           value={source}
//           onChange={(e) => setSource(e.target.value)}
//         >
//           <option value="">Select Source</option>
//           {stations.map((station) => (
//             <option key={station} value={station}>
//               {station}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="mb-4">
//         <label className="block text-gray-700 mb-2">Select Destination:</label>
//         <select
//           className="w-full border border-gray-300 rounded px-3 py-2"
//           value={destination}
//           onChange={(e) => setDestination(e.target.value)}
//         >
//           <option value="">Select Destination</option>
//           {stations.map((station) => (
//             <option key={station} value={station}>
//               {station}
//             </option>
//           ))}
//         </select>
//       </div>

//       <button
//         className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mb-4"
//         onClick={calculatePrice}
//       >
//         Calculate Price
//       </button>

//       {price > 0 && (
//         <p className="text-xl text-green-600 mb-4">Price: ₹{price}</p>
//       )}

//       <button
//         className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
//         onClick={handlePayment}
//       >
//         Proceed to Payment
//       </button>

//       {error && <p className="mt-4 text-red-500">{error}</p>}
//       {success && <p className="mt-4 text-green-500">{success}</p>}
//     </div>
//   );
// };

// export default Dashboard;

