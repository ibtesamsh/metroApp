// import axios from 'axios';

// export const API_URL = 'http://localhost:3000/api';

// // Create an Axios instance
// const api = axios.create({
//     baseURL: API_URL,
// });

// // Set up an interceptor to add the Authorization header if a token is present
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default api; // Export api as the default export

// // Auth API requests
// export const registerUser = (userData) => api.post('/register', userData);
// export const loginUser = (userData) => api.post('/login', userData);
// export const logoutUser = (userData) => api.post('/logout', userData);

// export const initiatePayment = (paymentData) => api.post('/buy-ticket', paymentData, {
//     headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('token')}`
//     }
// });
// export const verifyTicketToken = (ticketToken) => api.post('/verify-ticket-token', { ticketToken }, {
//     headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('token')}`
//     }
// });
// // export const updateTicketStatus = (ticketToken, status) => {
// //     return api.patch(`/ticket/${ticketToken}/status`, { status }, {
// //         headers: {
// //             'Content-Type': 'application/json',
// //             Authorization: `Bearer ${localStorage.getItem('token')}`,
// //         },
// //     });
// // };
// export const validateForwardTicket = (ticketToken, source, destination) => {
//     return api.post('/tickets/validate/forward', {
//         ticketToken,
//         source,
//         destination
      
//     });
// };

// export const validateBackwardTicket = (ticketToken, source, destination) => {
//     return api.post('/tickets/validate/backward', { ticketToken, source, destination }, {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
           
//         },
        
//     });
// };

// export const validateSourceInJourney = (ticketToken, source) => {
//     return axios.post('/validate-source', { ticketToken, source });
// };

// // Function to validate destination
// export const validateDestinationValid = (ticketToken, source, destination) => {
//     return axios.post('/validate-destination', { ticketToken, source, destination });
// };


import axios from 'axios';

export const API_URL = 'http://localhost:3000/api';

// Create an Axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Set up an interceptor to add the Authorization header if a token is present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api; // Export api as the default export

// Auth API requests
export const registerUser = (userData) => api.post('/register', userData);
export const loginUser = (userData) => api.post('/login', userData);
export const logoutUser = (userData) => api.post('/logout', userData);

export const initiatePayment = (paymentData) => api.post('/buy-ticket', paymentData, {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export const startJourney = (journey) => api.post('/start-journey', journey);
export const completeJourney = (journey) => api.post('/complete-journey', journey);