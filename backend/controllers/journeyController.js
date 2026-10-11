import { Ticket } from "../models/ticket.model.js";
import { redis } from "../server.js";
import { buildTicketRoute } from "../helper/metroUtils.js";

export const startJourney = async (req, res) => {
  const { ticketToken, source } = req.body;

  if (!ticketToken || !source) {
    return res.status(400).json({ success: false, message: "ticketToken and source are required." });
  }

  try {
    const ticket = await Ticket.findOne({ ticketToken });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Invalid ticket token." });
    }
    if (String(ticket.userId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "This ticket does not belong to you." });
    }
    if (ticket.status !== "Active") {
      return res.status(400).json({ success: false, message: "Ticket is not active, already used, or expired." });
    }
    if (new Date() > ticket.expiredAt) {
      ticket.status = "Expired";
      await ticket.save();
      await redis.del(`tickets:${ticket.userId}`);
      return res.status(400).json({ success: false, message: "Ticket has expired." });
    }

    // Walks every leg of the ticket (including interchanges), unlike the old
    // logic which only checked a single line and rejected every interchange
    // ticket outright.
    const route = buildTicketRoute(ticket.source, ticket.destination, ticket.via);
    if (!route || !route.includes(source)) {
      return res.status(400).json({ success: false, message: "You cannot start the journey from this station." });
    }

    ticket.status = "In Journey";
    await ticket.save();
    await redis.del(`tickets:${ticket.userId}`);

    return res.status(200).json({ success: true, message: "Journey started successfully.", ticket });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error starting the journey.", error: error.message });
  }
};

export const completeJourney = async (req, res) => {
  const { ticketToken, exitStation } = req.body;

  if (!ticketToken || !exitStation) {
    return res.status(400).json({ success: false, message: "ticketToken and exitStation are required." });
  }

  try {
    const ticket = await Ticket.findOne({ ticketToken });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Invalid ticket token." });
    }
    if (String(ticket.userId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "This ticket does not belong to you." });
    }
    if (ticket.status !== "In Journey") {
      return res.status(400).json({ success: false, message: "Ticket is not in a valid state to complete the journey." });
    }

    const route = buildTicketRoute(ticket.source, ticket.destination, ticket.via);
    if (!route || !route.includes(exitStation)) {
      return res.status(400).json({ success: false, message: "Invalid exit station for this ticket." });
    }

    ticket.status = "Completed";
    await ticket.save();
    await redis.del(`tickets:${ticket.userId}`);

    return res.status(200).json({ success: true, message: "Journey completed successfully.", ticket });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error completing the journey.", error: error.message });
  }
};
