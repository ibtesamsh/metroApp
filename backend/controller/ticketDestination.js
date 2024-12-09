import { Ticket } from "../models/ticket.model.js"; 
import { metroData } from "../data.js"; // Import metroData here

const validateDestinationValid = async (req, res) => {
    const { ticketToken, source, destination, line } = req.body;

    // Check if required fields are missing
    if (!ticketToken || !source || !destination || !line) {
        return res.status(400).send('Missing required fields: ticketToken, source, destination, or line');
    }

    try {
        // Find the ticket from the database using the ticketToken
        const ticket = await Ticket.findOne({ ticketToken });

        if (!ticket) {
            return res.status(404).send('Ticket not found');
        }

        // Log ticket to verify its properties
        console.log('Ticket:', ticket);

        // Find the line data from metroData based on the line provided in the request body
        const lineData = metroData.find((lineData) => lineData.line === line);

        if (!lineData) {
            return res.status(400).send('Invalid line for the ticket');
        }

        const stations = lineData.stations;  // Get stations for the given line

        // Find the index of the source and destination stations in the line
        const sourceIndex = stations.findIndex((station) => station.name === source);
        const destinationIndex = stations.findIndex((station) => station.name === destination);

        // If the source or destination station is not found, return an error
        if (sourceIndex === -1 || destinationIndex === -1) {
            return res.status(400).send('Invalid source or destination station');
        }

        // Find the ticket's source and destination indexes in the stations array
        const ticketSourceIndex = stations.findIndex(station => station.name === ticket.source);
        const ticketDestinationIndex = stations.findIndex(station => station.name === ticket.destination);

        // Check that the destination is after the source and before or equal to the ticket's destination
        if (sourceIndex < destinationIndex) {
            if (destinationIndex <= ticketDestinationIndex && destinationIndex > ticketSourceIndex) {
                // Destination is valid, update the status to 'Completed'
                ticket.status = 'Completed';
                await ticket.save();  // Save the updated ticket

                return res.status(200).json({
                    success: true,
                    message: 'Ticket validated successfully for destination (Completed)',
                    status: ticket.status,
                });
            } else {
                return res.status(400).send('Destination comes after the ticket\'s destination');
            }
        }

        return res.status(400).send('Invalid destination for this ticket: must be after the source station');

    } catch (error) {
        console.error('Error validating ticket destination:', error);
        return res.status(500).json({ success: false, message: 'Validation failed', error });
    }
};

export default validateDestinationValid;
