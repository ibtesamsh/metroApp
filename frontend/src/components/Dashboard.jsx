import React, { useState, useEffect } from 'react';
import { initiatePayment, verifyTicketToken } from '../api'; // Import necessary API functions
import { saveAs } from 'file-saver';  // Import the file-saver library

const Dashboard = () => {
    const [selectedLine, setSelectedLine] = useState('');
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [price, setPrice] = useState(0);
    const [stations, setStations] = useState([]);
    const [ticketToken, setTicketToken] = useState(localStorage.getItem('ticketToken') || ''); // Retrieve token from localStorage if available
    const [ticket, setTicket] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);  // Manage modal visibility
    const [generatedTicket, setGeneratedTicket] = useState(null); // Store generated ticket details
    const token = localStorage.getItem('token');

    const metroData = [
        {
            line: "Line 1",
            stations: [
                { name: "Versova", distanceFromStart: 0 },
                { name: "D N Nagar", distanceFromStart: 1.5 },
                { name: "Azad Nagar", distanceFromStart: 3.0 },
                { name: "Andheri", distanceFromStart: 5.0 },
                { name: "Ghatkopar", distanceFromStart: 11.4 },
            ],
        },
        {
            line: "Line 2A",
            stations: [
                { name: "Dahisar East", distanceFromStart: 0 },
                { name: "Anand Nagar", distanceFromStart: 2.0 },
                { name: "Borivali West", distanceFromStart: 5.0 },
            ],
        },
    ];

    // Ensure the user is logged in
    if (!token) {
        window.location.href = '/login';
    }

    // Clear the ticket token input when the page is refreshed
    useEffect(() => {
        setTicketToken('');
    }, []);

    // Update the stations based on the selected line
    useEffect(() => {
        const selectedMetro = metroData.find((line) => line.line === selectedLine);
        if (selectedMetro) {
            setStations(selectedMetro.stations);
            setSource('');
            setDestination('');
        } else {
            setStations([]);
            setSource('');
            setDestination('');
        }
    }, [selectedLine]);

    const calculatePrice = () => {
        const sourceStation = stations.find(station => station.name === source);
        const destinationStation = stations.find(station => station.name === destination);

        if (sourceStation && destinationStation) {
            const distance = Math.abs(destinationStation.distanceFromStart - sourceStation.distanceFromStart);
            setPrice(distance * 10); // ₹10 per km
            setError('');
        } else {
            setPrice(0);
            setError('Please select valid source and destination stations.');
        }
    };

    const handlePayment = async () => {
        if (!source || !destination || price === 0) {
            setError('Complete all fields and calculate the price before proceeding.');
            return;
        }
        try {
            const paymentData = { source, destination, price };
            const response = await initiatePayment(paymentData);

            // Generate the ticket object after successful payment
            const ticketData = {
                userId: token, // Assuming token is the user ID
                source,
                destination,
                ticketId: response.data.ticket.token,
                issuedAt: new Date(),
                price,
                status: 'Paid',
            };

            // Store the generated ticket token in localStorage
            localStorage.setItem('ticketToken', response.data.ticket.token);

            setGeneratedTicket(ticketData); // Store generated ticket data
            setSuccess('Payment successful! Ticket generated.');
            setShowModal(true); // Show the modal
            setError('');
        } catch (err) {
            setError('An error occurred during payment. Please try again.');
            console.error(err);
        }
    };

    const handleVerifyTicket = async () => {
        // Use the ticket token from localStorage if it's available
        const tokenToVerify = ticketToken || localStorage.getItem('ticketToken');

        if (!tokenToVerify) {
            setError('Please enter a valid ticket token.');
            return;
        }

        try {
            const response = await verifyTicketToken(tokenToVerify);
            if (response.data.success) {
                setTicket(response.data.ticket);
                setError('');
                setSuccess('Ticket verified successfully.');
            } else {
                setError('Ticket not found.');
                setTicket(null);
            }
        } catch (err) {
            setError('An error occurred while verifying the ticket.');
            console.error(err);
        }
    };

    // Function to download the ticket as a file
    const downloadTicket = () => {
        const ticketData = {
            source: generatedTicket.source,
            destination: generatedTicket.destination,
            price: generatedTicket.price,
            issuedAt: new Date(generatedTicket.issuedAt).toLocaleString(),
            status: generatedTicket.status,
            ticketToken: generatedTicket.ticketId,
        };

        const blob = new Blob([JSON.stringify(ticketData, null, 2)], {
            type: 'application/json',
        });
        saveAs(blob, `ticket_${generatedTicket.ticketId}.json`); // Save the ticket as a .json file
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        localStorage.removeItem('ticketToken'); // Remove ticket token as well
        window.location.href = '/login'; // Redirect to login page
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Metro Ticket Booking</h1>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 mb-4"
            >
                Logout
            </button>

            {/* Line Selection */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Line:</label>
                <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={selectedLine}
                    onChange={(e) => setSelectedLine(e.target.value)}
                >
                    <option value="">Select Line</option>
                    {metroData.map((line) => (
                        <option key={line.line} value={line.line}>
                            {line.line}
                        </option>
                    ))}
                </select>
            </div>

            {/* Source Selection */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Source:</label>
                <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    disabled={stations.length === 0}
                >
                    <option value="">Select Source</option>
                    {stations.map((station) => (
                        <option key={station.name} value={station.name}>
                            {station.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Destination Selection */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Destination:</label>
                <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    disabled={stations.length === 0}
                >
                    <option value="">Select Destination</option>
                    {stations.map((station) => (
                        <option key={station.name} value={station.name}>
                            {station.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Calculate Price Button */}
            <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mb-4"
                onClick={calculatePrice}
            >
                Calculate Price
            </button>

            {/* Display Price */}
            {price > 0 && <p className="text-xl text-green-600 mb-4">Price: ₹{price}</p>}

            {/* Proceed to Payment Button */}
            <button
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
                onClick={handlePayment}
            >
                Proceed to Payment
            </button>

            {/* Ticket Token Verification */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Verify Ticket Token</h2>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                    value={ticketToken}
                    onChange={(e) => setTicketToken(e.target.value)}
                    placeholder="Enter Ticket Token"
                />
                <button
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                    onClick={handleVerifyTicket}
                >
                    Verify Ticket
                </button>

                {/* Display Ticket Information */}
                {ticket && (
                    <div className="mt-6 p-4 border border-gray-300 rounded">
                        <p><strong>Source:</strong> {ticket.source}</p>
                        <p><strong>Destination:</strong> {ticket.destination}</p>
                        <p><strong>Price:</strong> ₹{ticket.price}</p>
                        <p><strong>Issued At:</strong> {new Date(ticket.issuedAt).toLocaleString()}</p>
                        <p><strong>Status:</strong> {ticket.status}</p>
                    </div>
                )}
            </div>

            {/* Modal - Ticket Details */}
            {showModal && generatedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-2xl font-semibold mb-4">Your Ticket</h2>
                        <div className="space-y-4">
                            <p><strong>Source:</strong> {generatedTicket.source}</p>
                            <p><strong>Destination:</strong> {generatedTicket.destination}</p>
                            <p><strong>Price:</strong> ₹{generatedTicket.price}</p>
                            <p><strong>Issued At:</strong> {new Date(generatedTicket.issuedAt).toLocaleString()}</p>
                            <p><strong>Status:</strong> {generatedTicket.status}</p>
                            <p><strong>Ticket Token:</strong> {generatedTicket.ticketId}</p>
                        </div>
                        <button
                            onClick={downloadTicket}
                            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Download Ticket
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Error and Success Messages */}
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {success && <p className="mt-4 text-green-500">{success}</p>}
        </div>
    );
};

export default Dashboard;







