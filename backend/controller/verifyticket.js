import { Ticket } from '../models/ticket.model.js';

const verifyTicketToken = async (req, res) => {
    const { ticketToken } = req.body;  // Get the ticketToken from the request body

    try {
        // Search for the ticket by its token
        const ticket = await Ticket.findOne({ ticketToken });

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        res.status(200).json({ success: true, ticket });  // Return ticket details
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export default verifyTicketToken;
