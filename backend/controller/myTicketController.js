// import { Ticket } from "../models/ticket.model.js";

// const getUserTickets = async (req, res) => {
//   const userId = req.user._id; 
//   try {
//     const tickets = await Ticket.find({ userId }).sort({ date: -1 });

//     if (!tickets) {
//       return res.status(404).json({ message: "No tickets found" });
//     }

//     return res.status(200).json({ tickets });
//   } catch (error) {
//     console.error("Error fetching tickets:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export default getUserTickets;


import { Ticket } from "../models/ticket.model.js";
import {redis} from "../server.js"
const getUserTickets = async (req, res) => {
  const userId = req.user._id;
  try {

    const cachedTickets = await redis.get(`tickets:${userId}`);

    if (cachedTickets) {
      console.log("Serving tickets from cache");
    
      return res.status(200).json({ tickets: JSON.parse(cachedTickets) });
    }

   
    const tickets = await Ticket.find({ userId }).sort({ date: -1 });

    if (!tickets) {
      return res.status(404).json({ message: "No tickets found" });
    }

    
    await redis.setex(`tickets:${userId}`, 60, JSON.stringify(tickets));

    console.log("Tickets fetched from database and cached");

    return res.status(200).json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default getUserTickets;
