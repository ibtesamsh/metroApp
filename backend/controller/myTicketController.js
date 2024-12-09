import { Ticket } from "../models/ticket.model.js";

const getUserTickets = async (req, res) => {
  const userId = req.user._id; 
  try {
    const tickets = await Ticket.find({ userId }).sort({ date: -1 });

    if (!tickets) {
      return res.status(404).json({ message: "No tickets found" });
    }

    return res.status(200).json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default getUserTickets;