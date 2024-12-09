import { metroData } from "../helper/metroData.js";
import { Ticket } from "../models/ticket.model.js";

const startJourney = async (req, res) => {
  const { ticketToken, source } = req.body;
  console.log(req.body);

  try {
    const ticket = await Ticket.findOne({ ticketToken });
    if (!ticket) {
      return res.status(404).json({ message: "Invalid token" });
    }
    if (ticket.status !== "Active") {
      return res
        .status(400)
        .json({ message: "Ticket is not active or already used" });
    }

    const currentTime = new Date();
    if (currentTime > ticket.expiredAt) {
      ticket.status = "Expired";
      await ticket.save();
      return res.status(400).json({ message: "Ticket is expired" });
    }

    const metroLine = metroData.lines.find(
      (line) =>
        line.stations.includes(ticket.source) &&
        line.stations.includes(ticket.destination)
    );

    if (!metroLine) {
      return res
        .status(400)
        .json({ message: "Invalid source or destination on the ticket" });
    }

    const stations = metroLine.stations;
    const sourceIndex = stations.indexOf(ticket.source);
    const destinationIndex = stations.indexOf(ticket.destination);
    const startingIndex = stations.indexOf(source);

    // Check if the starting station is between source and destination, inclusive, in both directions
    const isForwardDirection =
      startingIndex >= Math.min(sourceIndex, destinationIndex) &&
      startingIndex <= Math.max(sourceIndex, destinationIndex);

    const isBackwardDirection =
      startingIndex <= Math.max(sourceIndex, destinationIndex) &&
      startingIndex >= Math.min(sourceIndex, destinationIndex);

    if (!isForwardDirection && !isBackwardDirection) {
      return res
        .status(400)
        .json({ message: "You cannot start the journey from this station" });
    }

    ticket.status = "In Journey";
    await ticket.save();

    return res
      .status(200)
      .json({ message: "Journey started successfully", ticket });
  } catch (error) {
    return res.status(500).json({
      message: "Error while starting the journey",
      error: error.message,
    });
  }
};

export default startJourney;