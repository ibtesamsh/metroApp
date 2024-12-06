import { v4 as uuidv4 } from 'uuid';
import { Ticket } from '../models/ticket.model.js';

const buyTicket = async (req, res) => {
    const { source, destination, price } = req.body;

    
    const userId = req.user ? req.user._id : null;

    if (!price || !source || !destination) {
        return res.status(400).send('Missing required fields: source, destination, or price');
    }

    try {
        const ticketToken = uuidv4(); 
        const issuedAt = new Date(); 
        const expiresAt = new Date(issuedAt.getTime() + 1 * 60 * 1000); 

        const saveTicket = { 
            userId, 
            ticketToken, 
            source, 
            destination, 
            price,
            issuedAt,
            expiresAt 
        };

        
        const ticket = new Ticket(saveTicket);
        await ticket.save();

        res.status(200).json({
            success: true,
            message: 'Payment successful',
            ticket: {
                userId: req.user._id,
                token: ticketToken,
                source,
                destination,
                price,
                issuedAt,
                expiresAt, 
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Payment failed', error });
    }
};

export default buyTicket;
