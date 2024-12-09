import express from 'express';
import authToken from '../middleware/authToken.js';
import userLogout from '../controller/userLogout.js';
import userLogin from '../controller/userLogin.js';
import userRegister from '../controller/userRegister.js';
import buyTicket from '../controller/buyTicketController.js';
import verifyTicketToken from '../controller/verifyticket.js';
import validateSourceInJourney from '../controller/ticketSource.js';
import validateDestinationValid from '../controller/ticketDestination.js'
import completeJourney from '../controller/completeJourney.js';
import startJourney from '../controller/journeyController.js';
import getUserTickets from '../controller/myTicketController.js';



// import ticketstatus from '../controller/ticketforward.js';
// import verifyTicketToken from '../controller/verifyTicketToken.js';
// import { fetchUserTickets, purchaseTicket } from '../controller/ticketController.js';
const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin)
router.post('/logout', authToken, userLogout);
router.post('/validate-source',authToken,validateSourceInJourney)
router.post('/verify-ticket-token', authToken, verifyTicketToken);
router.post('/validate-destination',authToken, validateDestinationValid)
// router.post('/purchase-ticket', authToken, purchaseTicket);
router.post('/buy-ticket', authToken , buyTicket);
router.post('/start-journey', authToken, startJourney);
router.post('/complete-journey', authToken, completeJourney);
router.get('/my-ticket', authToken, getUserTickets);
// router.get('/fetchUserTickets', authToken, fetchUserTickets);
// router.patch('/ticket/:ticketToken/status',authToken,ticketstatus)

export default router;