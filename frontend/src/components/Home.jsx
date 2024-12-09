// import React, { useState } from "react";
// import Dashboard from "./Dashboard";
// import Logout from "./Logout";
// import MyTickets from "./MyTickets";
// import StartJourney from "./StartJourney";
// import CompleteJourney from "./CompleteJourney";

// const Home = () => {
//   const [currentView, setCurrentView] = useState("bookTicket"); //state of dashboard

//   const hanldeChangeView = (view) => setCurrentView(view);
//   return (
//     <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
//       <h1 className="text-lg uppercase font-bold text-center mb-7">
//         metro Dashboard
//       </h1>
//       <div className="flex justify-between">
//         <button
//           className={`py-2 px-4 rounded ${
//             currentView === "bookTicket"
//               ? "bg-blue-500 text-white"
//               : "bg-gray-200"
//           }`}
//           onClick={() => hanldeChangeView("bookTicket")}
//         >
//           Book Ticket
//         </button>
//         <button
//           className={`py-2 px-4 rounded ${
//             currentView === "viewTicket"
//               ? "bg-blue-500 text-white"
//               : "bg-gray-200"
//           }`}
//           onClick={() => hanldeChangeView("viewTicket")}
//         >
//           View Ticket
//         </button>
//         <button
//           className={`py-2 px-4 rounded ${
//             currentView === "startJourney"
//               ? "bg-blue-500 text-white"
//               : "bg-gray-200"
//           }`}
//           onClick={() => hanldeChangeView("startJourney")}
//         >
//           Start Journey
//         </button>
//         <button
//           className={`py-2 px-4 rounded ${
//             currentView === "completeJourney"
//               ? "bg-blue-500 text-white"
//               : "bg-gray-200"
//           }`}
//           onClick={() => hanldeChangeView("completeJourney")}
//         >
//           Complete Journey
//         </button>
//       </div>

//       <div>
//         {currentView === "bookTicket" && <Dashboard />}
//         {currentView === "viewTicket" && <MyTickets />}
//         {currentView === "startJourney" && <StartJourney />}
//         {currentView === "completeJourney" && <CompleteJourney />}
//       </div>

//       <div>
//         <Logout />
//       </div>
//     </div>
//   );
// };

// export default Home;


import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Logout from "./Logout";
import MyTickets from "./MyTickets";
import StartJourney from "./StartJourney";
import CompleteJourney from "./CompleteJourney";

const Home = () => {
  const [currentView, setCurrentView] = useState("bookTicket");

  const handleChangeView = (view) => setCurrentView(view);

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Metro Dashboard
      </h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`py-2 px-6 rounded-lg font-medium text-sm transition duration-300 ${
            currentView === "bookTicket"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => handleChangeView("bookTicket")}
        >
          Book Ticket
        </button>

        <button
          className={`py-2 px-6 rounded-lg font-medium text-sm transition duration-300 ${
            currentView === "viewTicket"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => handleChangeView("viewTicket")}
        >
          View Ticket
        </button>

        <button
          className={`py-2 px-6 rounded-lg font-medium text-sm transition duration-300 ${
            currentView === "startJourney"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => handleChangeView("startJourney")}
        >
          Start Journey
        </button>

        <button
          className={`py-2 px-6 rounded-lg font-medium text-sm transition duration-300 ${
            currentView === "completeJourney"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => handleChangeView("completeJourney")}
        >
          Complete Journey
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
        {currentView === "bookTicket" && <Dashboard />}
        {currentView === "viewTicket" && <MyTickets />}
        {currentView === "startJourney" && <StartJourney />}
        {currentView === "completeJourney" && <CompleteJourney />}
      </div>

      <div className="mt-8">
        <Logout />
      </div>
    </div>
  );
};

export default Home;
