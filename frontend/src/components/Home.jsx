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


// import React, { useState } from "react";
// import Dashboard from "./Dashboard";
// import Logout from "./Logout";
// import MyTickets from "./MyTickets";
// import StartJourney from "./StartJourney";
// import CompleteJourney from "./CompleteJourney";
// import VerifyTicket from "./VerifyTicket";

// const Home = () => {
//   const [currentView, setCurrentView] = useState("bookTicket");

//   const handleChangeView = (view) => setCurrentView(view);

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       {/* Sidebar */}
//       <aside className="w-64 bg-blue-800 text-white p-6">
//         <h2 className="text-2xl font-semibold mb-8">Metro Dashboard</h2>
//         <nav className="space-y-4">
//           <button
//             className={`w-full text-left py-2 px-4 rounded-lg font-medium text-sm transition duration-300 ${
//               currentView === "bookTicket"
//                 ? "bg-blue-600"
//                 : "bg-blue-700 hover:bg-blue-600"
//             }`}
//             onClick={() => handleChangeView("bookTicket")}
//           >
//             Book Ticket
//           </button>
//           <button
//             className={`w-full text-left py-2 px-4 rounded-lg font-medium text-sm transition duration-300 ${
//               currentView === "viewTicket"
//                 ? "bg-blue-600"
//                 : "bg-blue-700 hover:bg-blue-600"
//             }`}
//             onClick={() => handleChangeView("viewTicket")}
//           >
//             View Ticket
//           </button>
//           <button
//             className={`w-full text-left py-2 px-4 rounded-lg font-medium text-sm transition duration-300 ${
//               currentView === "startJourney"
//                 ? "bg-blue-600"
//                 : "bg-blue-700 hover:bg-blue-600"
//             }`}
//             onClick={() => handleChangeView("startJourney")}
//           >
//             Start Journey
//           </button>
//           <button
//             className={`w-full text-left py-2 px-4 rounded-lg font-medium text-sm transition duration-300 ${
//               currentView === "completeJourney"
//                 ? "bg-blue-600"
//                 : "bg-blue-700 hover:bg-blue-600"
//             }`}
//             onClick={() => handleChangeView("completeJourney")}
//           >
//             Complete Journey
//           </button>
//           <button
//             className={`w-full text-left py-2 px-4 rounded-lg font-medium text-sm transition duration-300 ${
//               currentView === "verifyTicket"
//                 ? "bg-blue-600"
//                 : "bg-blue-700 hover:bg-blue-600"
//             }`}
//             onClick={() => handleChangeView("verifyTicket")}
//           >
//             Verify Ticket
//           </button>
//           <div className="mt-8">
//           <Logout/>
//         </div>
//         </nav>
//       </aside>

//       {/* Main Content Area */}
//       <main className="flex-1 p-8">
//         <div className="bg-white rounded-lg shadow-xl p-6">
//           {currentView === "bookTicket" && <Dashboard />}
//           {currentView === "viewTicket" && <MyTickets />}
//           {currentView === "startJourney" && <StartJourney />}
//           {currentView === "completeJourney" && <CompleteJourney />}
//           {currentView === "verifyTicket" && <VerifyTicket />}
//         </div>

//         {/* Logout Section */}
        
//       </main>
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
import VerifyTicket from "./VerifyyTicket";

const Home = () => {
  const [currentView, setCurrentView] = useState("bookTicket");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

 
  const handleChangeView = (view) => {
    setCurrentView(view);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false); // Close the sidebar on mobile
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-blue-800 text-white p-6 fixed top-0 left-0 h-full z-50`}
      >
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
            <Logout />
          </div>
        </nav>
      </aside>

      {/* Overlay when sidebar is open */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } fixed inset-0 bg-black opacity-50 md:hidden z-40`}
        onClick={toggleSidebar}
      ></div>

      {/* Main Content Area */}
      <main
        className={`flex-1 p-8 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64 flex items-center justify-center`}
      >
        <div className=" rounded-lg  p-6 mx-auto w-full max-w-7xl">
          {currentView === "bookTicket" && <Dashboard />}
          {currentView === "viewTicket" && <MyTickets />}
          {currentView === "startJourney" && <StartJourney />}
          {currentView === "completeJourney" && <CompleteJourney />}
          {currentView === "verifyTicket" && <VerifyTicket />}
        </div>
      </main>

      {/* Hamburger Menu Icon */}
      <button
        className="md:hidden absolute top-6 left-6 z-60"
        onClick={toggleSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white bg-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default Home;










