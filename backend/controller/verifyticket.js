import { Ticket } from '../models/ticket.model.js';

const verifyTicketToken = async (req, res) => {
    const { ticketToken } = req.body;  

    try {
       
        const ticket = await Ticket.findOne({ ticketToken });

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        res.status(200).json({ success: true, ticket }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export default verifyTicketToken;
