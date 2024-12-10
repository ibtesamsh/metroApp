import { metroData } from "../helper/metroData.js";
import { Ticket } from "../models/ticket.model.js";

const completeJourney = async (req, res) => {
    const { ticketToken, exitStation } = req.body;
    console.log(req.body);

    try {
        const ticket = await Ticket.findOne({ ticketToken });
        if (!ticket) {
            return res.status(404).json({ message: "invalid token" });
        }
        if (ticket.status !== "In Journey") {
            return res.status(400).json({
                message: "Ticket is not in valid state to complete the journey",
            });
        }

        const metroLine = metroData.lines.find(
            (line) =>
                line.stations.includes(ticket.source) &&
                line.stations.includes(ticket.destination)
        );

        if (!metroLine) {
            return res
                .status(400)
                .json({ message: "invalid source or detination on the ticket" });
        }

        const stations = metroLine.stations;
        const sourceIndex = stations.indexOf(ticket.source);
        const destinationIndex = stations.indexOf(ticket.destination);
        const exitIndex = stations.indexOf(exitStation);

        const isValidExit =
            exitIndex >= Math.min(sourceIndex, destinationIndex) &&
            exitIndex <= Math.max(sourceIndex, destinationIndex);

        if (!isValidExit) {
            return res
                .status(400)
                .json({ message: "Invalid exit station for this ticket" });
        }

        ticket.status = "Completed";
        await ticket.save();
        return res.status(200).json({ message: "Journey completed successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "an error occured while completing the journey",
            error: error.message,
        });
    }
};

export default completeJourney;