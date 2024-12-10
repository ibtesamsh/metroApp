// import React, { useState } from "react";
// import Dashboard from "./Dashboard";
// import Logout from "./Logout";
// import MyTickets from "./MyTickets";
// import StartJourney from "./StartJourney";
// import CompleteJourney from "./CompleteJourney";
// import VerifyTicket from "./verifyticket";

// const Home = () => {
//   const [currentView, setCurrentView] = useState("bookTicket");

//   const handleChangeView = (view) => setCurrentView(view);

//   return (
//     <div className="p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-lg">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
//         Metro Dashboard
//       </h1>

//       <div className="flex justify-center space-x-4 mb-6">
//         <button
//           className={`py-2 px-6 rounded-lg font-medium text-sm transition duration-300 ${
//             currentView === "bookTicket"
//               ? "bg-blue-600 text-white shadow-md"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//           }`}
//           onClick={() => handleChangeView("bookTicket")}
//         >
//           Book Ticket
//         </button>

//         <button
//           className={`py-2 px-6 rounded-lg font-medium text-sm transition duration-300 ${
//             currentView === "viewTicket"
//               ? "bg-blue-600 text-white shadow-md"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//           }`}
//           onClick={() => handleChangeView("viewTicket")}
//         >
//           View Ticket
//         </button>

//         <button
//           className={`py-2 px-6 rounded-lg font-medium text-sm transition duration-300 ${
//             currentView === "startJourney"
//               ? "bg-blue-600 text-white shadow-md"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//           }`}
//           onClick={() => handleChangeView("startJourney")}
//         >
//           Start Journey
//         </button>

//         <button
//           className={`py-2 px-6 rounded-lg font-medium text-sm transition duration-300 ${
//             currentView === "completeJourney"
//               ? "bg-blue-600 text-white shadow-md"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//           }`}
//           onClick={() => handleChangeView("completeJourney")}
//         >
//           Complete Journey
//         </button>
//         <button
//           className={`py-2 px-6 rounded-lg font-medium text-sm transition duration-300 ${
//             currentView === "verifyTicket"
//               ? "bg-blue-600 text-white shadow-md"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//           }`}
//           onClick={() => handleChangeView("verifyTicket")}
//         >
//           Verify Ticket
//         </button>
//       </div>

//       <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
//         {currentView === "bookTicket" && <Dashboard />}
//         {currentView === "viewTicket" && <MyTickets />}
//         {currentView === "startJourney" && <StartJourney />}
//         {currentView === "completeJourney" && <CompleteJourney />}
//         {currentView==="verifyTicket"&&<VerifyTicket/>}
//       </div>

//       <div className="mt-8">
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
import VerifyTicket from "./VerifyTicket";

const Home = () => {
  const [currentView, setCurrentView] = useState("bookTicket");

  const handleChangeView = (view) => setCurrentView(view);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-6">
        <h2 className="text-2xl font-semibold mb-8">Metro Dashboard</h2>
        <nav className="space-y-4">
          <button
            className={`w-full text-left py-2 px-4 rounded-lg font-medium text-sm transition duration-300 ${
              currentView === "bookTicket"
                ? "bg-blue-600"
                : "bg-blue-700 hover:bg-blue-600"
            }`}
            onClick={() => handleChangeView("bookTicket")}
          >
            Book Ticket
          </button>
          <button
            className={`w-full text-left py-2 px-4 rounded-lg font-medium text-sm transition duration-300 ${
              currentView === "viewTicket"
                ? "bg-blue-600"
                : "bg-blue-700 hover:bg-blue-600"
            }`}
            onClick={() => handleChangeView("viewTicket")}
          >
            View Ticket
          </button>
          <button
            className={`w-full text-left py-2 px-4 rounded-lg font-medium text-sm transition duration-300 ${
              currentView === "startJourney"
                ? "bg-blue-600"
                : "bg-blue-700 hover:bg-blue-600"
            }`}
            onClick={() => handleChangeView("startJourney")}
          >
            Start Journey
          </button>
          <button
            className={`w-full text-left py-2 px-4 rounded-lg font-medium text-sm transition duration-300 ${
              currentView === "completeJourney"
                ? "bg-blue-600"
                : "bg-blue-700 hover:bg-blue-600"
            }`}
            onClick={() => handleChangeView("completeJourney")}
          >
            Complete Journey
          </button>
          <button
            className={`w-full text-left py-2 px-4 rounded-lg font-medium text-sm transition duration-300 ${
              currentView === "verifyTicket"
                ? "bg-blue-600"
                : "bg-blue-700 hover:bg-blue-600"
            }`}
            onClick={() => handleChangeView("verifyTicket")}
          >
            Verify Ticket
          </button>
          <div className="mt-8">
          <Logout/>
        </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-xl p-6">
          {currentView === "bookTicket" && <Dashboard />}
          {currentView === "viewTicket" && <MyTickets />}
          {currentView === "startJourney" && <StartJourney />}
          {currentView === "completeJourney" && <CompleteJourney />}
          {currentView === "verifyTicket" && <VerifyTicket />}
        </div>

        {/* Logout Section */}
        
      </main>
    </div>
  );
};

export default Home;
