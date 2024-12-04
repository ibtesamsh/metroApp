import express from 'express';
import authToken from '../middleware/authToken.js';
import userLogout from '../controller/userLogout.js';
import userLogin from '../controller/userLogin.js';
import userRegister from '../controller/userRegister.js';
import buyTicket from '../controller/buyTicketController.js';
import verifyTicketToken from '../controller/verifyticket.js';
// import verifyTicketToken from '../controller/verifyTicketToken.js';
// import { fetchUserTickets, purchaseTicket } from '../controller/ticketController.js';
const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin)
router.post('/logout', authToken, userLogout);


router.post('/verify-ticket-token', authToken, verifyTicketToken);
// router.post('/purchase-ticket', authToken, purchaseTicket);
router.post('/buy-ticket', authToken , buyTicket);
// router.get('/fetchUserTickets', authToken, fetchUserTickets);


export default router;