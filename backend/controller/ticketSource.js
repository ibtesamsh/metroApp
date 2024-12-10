import { metroData } from "../data.js";  // Import metroData directly
import { Ticket } from "../models/ticket.model.js";  // Import Ticket model

const validateSourceInJourney = async (req, res) => {
    const { ticketToken, source, line } = req.body;

    // Check if required fields are missing
    if (!ticketToken || !source || !line) {
        return res.status(400).send('Missing required fields: ticketToken, source, or line');
    }

    try {
        // Find the ticket from the database using the ticketToken
        const ticket = await Ticket.findOne({ ticketToken });

        if (!ticket) {
            return res.status(404).send('Ticket not found');
        }

        // Log the ticket to check its properties
        // console.log('Ticket:', ticket);

        // Find the line data from metroData based on the line provided in the request body
        const lineData = metroData.find((lineData) => lineData.line === line);

        // If the line does not exist in metroData, return an error
        if (!lineData) {
            return res.status(400).send('Invalid line for the ticket');
        }

        const stations = lineData.stations;  // Get stations for the given line

        // Find the index of the source station in the line
        const sourceIndex = stations.findIndex((station) => station.name === source);
        
        // If the source station is not found, return an error
        if (sourceIndex === -1) {
            return res.status(400).send('Invalid source station');
        }

        // Find the index of the ticket's destination station in the line
        const ticketSourceIndex = stations.findIndex((station) => station.name === ticket.source);
        const ticketDestinationIndex = stations.findIndex((station) => station.name === ticket.destination);

        // Ensure the source is before or the same as the destination for this ticket
        if (ticketSourceIndex === -1 || ticketDestinationIndex === -1) {
            return res.status(400).send('Ticket source or destination not found in line');
        }

        // Check if the source station in the request is before or the same as the ticket's destination
        if (sourceIndex < ticketSourceIndex || sourceIndex > ticketDestinationIndex) {
            return res.status(400).send('Invalid source station for this ticket');
        }

        // Now that we know the source is valid, we can update the ticket status
        ticket.status = 'In-journey';  // Change the ticket status to 'In-journey'

        // Save the updated ticket status back to the database
        await ticket.save();  // Save the ticket after status update

        return res.status(200).json({
            success: true,
            message: 'Ticket validated successfully for source (In-journey)',
            status: ticket.status,
        });

    } catch (error) {
        console.error('Error validating ticket source:', error);
        return res.status(500).json({ success: false, message: 'Validation failed', error });
    }
};

export default validateSourceInJourney;
