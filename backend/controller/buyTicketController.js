// import { v4 as uuidv4 } from 'uuid';
// import { Ticket } from '../models/ticket.model.js';

// const buyTicket = async (req, res) => {
//     const { source, destination, price } = req.body;

    
//     const userId = req.user ? req.user._id : null;

//     if (!price || !source || !destination) {
//         return res.status(400).send('Missing required fields: source, destination, or price');
//     }

//     try {
//         const ticketToken = uuidv4(); 
//         const issuedAt = new Date(); 
//         const expiresAt = new Date(issuedAt.getTime() + 60 * 60 * 1000); 

//         const saveTicket = { 
//             userId, 
//             ticketToken, 
//             source, 
//             destination, 
//             price,
//             issuedAt,
//             expiresAt 
//         };

        
//         const ticket = new Ticket(saveTicket);
//         await ticket.save();

//         res.status(200).json({
//             success: true,
//             message: 'Payment successful',
//             ticket: {
//                 userId: req.user._id,
//                 token: ticketToken,
//                 source,
//                 destination,
//                 price,
//                 issuedAt,
//                 expiresAt, 
//             },
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Payment failed', error });
//     }
// };

// export default buyTicket;

// import { v4 as uuidv4 } from "uuid";
// import { Ticket } from "../models/ticket.model.js";
// import { metroData } from "../helper/metroData.js";

// const buyTicket = async (req, res) => {
//   const { source, destination } = req.body;
//   const userId = req.user ? req.user._id : null;

//   if (!source || !destination) {
//     return res.status(400).json({
//       success: false,
//       message: "Source and destination are required.",
//     });
//   }

//   try {
//     // Find lines containing source and destination
//     const sourceLine = metroData.lines.find((line) =>
//       line.stations.includes(source)
//     );
//     const destinationLine = metroData.lines.find((line) =>
//       line.stations.includes(destination)
//     );

//     if (!sourceLine || !destinationLine) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid source or destination.",
//       });
//     }

//     let viaStation = null;
//     let totalDistance = 0;

//     if (sourceLine.line !== destinationLine.line) {
//       // Find common stations for interchange
//       const commonStations = sourceLine.stations.filter((station) =>
//         destinationLine.stations.includes(station)
//       );

//       if (commonStations.length === 0) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "No valid interchange station exists between the selected lines.",
//         });
//       }

//       // Select the first common station as the via
//       viaStation = commonStations[0];

//       // Calculate distance
//       const sourceIndex = sourceLine.stations.indexOf(source);
//       const viaIndexSource = sourceLine.stations.indexOf(viaStation);
//       const viaIndexDestination = destinationLine.stations.indexOf(viaStation);
//       const destinationIndex = destinationLine.stations.indexOf(destination);

//       totalDistance =
//         Math.abs(viaIndexSource - sourceIndex) +
//         Math.abs(destinationIndex - viaIndexDestination);
//     } else {
//       // Same line journey
//       const sourceIndex = sourceLine.stations.indexOf(source);
//       const destinationIndex = sourceLine.stations.indexOf(destination);
//       totalDistance = Math.abs(destinationIndex - sourceIndex);
//     }

//     // Calculate price (e.g., ₹10 per station)
//     const price = totalDistance * 10;

//     // Create ticket object
//     const ticket = new Ticket({
//       userId,
//       ticketToken: uuidv4(),
//       source,
//       destination,
//       via: viaStation ? [viaStation] : [],
//       price,
//       issuedAt: new Date(),
//       expiredAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1-hour validity
//     });

//     await ticket.save();

//     res.status(200).json({
//       success: true,
//       message: "Ticket purchased successfully.",
//       ticket,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error purchasing ticket.",
//       error: error.message,
//     });
//   }
// };

// export default buyTicket;

// import { v4 as uuidv4 } from "uuid";
// import { Ticket } from "../models/ticket.model.js";
// import { metroData } from "../helper/metroData.js";

// // Function to update expired tickets
// const updateExpiredTickets = async () => {
//   try {
//     const currentTime = new Date();
//     // Find tickets that are still active and have expired
//     const expiredTickets = await Ticket.find({
//       expiredAt: { $lte: currentTime },
//       status: "Active", // Only update tickets that are active
//     });

//     // Update the status to 'Expired' for each expired ticket
//     for (let ticket of expiredTickets) {
//       ticket.status = "Expired";
//       await ticket.save();
//     }

//     // console.log(`${expiredTickets.length} tickets marked as expired.`);
//   } catch (error) {
//     console.error("Error updating expired tickets:", error.message);
//   }
// };

// // Function to buy a ticket
// const buyTicket = async (req, res) => {
//   const { source, destination } = req.body;
//   const userId = req.user ? req.user._id : null;

//   if (!source || !destination) {
//     return res.status(400).json({
//       success: false,
//       message: "Source and destination are required.",
//     });
//   }

//   try {
//     // Find lines containing source and destination
//     const sourceLine = metroData.lines.find((line) =>
//       line.stations.includes(source)
//     );
//     const destinationLine = metroData.lines.find((line) =>
//       line.stations.includes(destination)
//     );

//     if (!sourceLine || !destinationLine) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid source or destination.",
//       });
//     }

//     let viaStation = null;
//     let totalDistance = 0;

//     if (sourceLine.line !== destinationLine.line) {
//       // Find common stations for interchange
//       const commonStations = sourceLine.stations.filter((station) =>
//         destinationLine.stations.includes(station)
//       );

//       if (commonStations.length === 0) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "No valid interchange station exists between the selected lines.",
//         });
//       }

//       // Select the first common station as the via
//       viaStation = commonStations[0];

//       // Calculate distance
//       const sourceIndex = sourceLine.stations.indexOf(source);
//       const viaIndexSource = sourceLine.stations.indexOf(viaStation);
//       const viaIndexDestination = destinationLine.stations.indexOf(viaStation);
//       const destinationIndex = destinationLine.stations.indexOf(destination);

//       totalDistance =
//         Math.abs(viaIndexSource - sourceIndex) +
//         Math.abs(destinationIndex - viaIndexDestination);
//     } else {
//       // Same line journey
//       const sourceIndex = sourceLine.stations.indexOf(source);
//       const destinationIndex = sourceLine.stations.indexOf(destination);
//       totalDistance = Math.abs(destinationIndex - sourceIndex);
//     }

//     // Calculate price (e.g., ₹10 per station)
//     const price = totalDistance * 10;

//     // Create ticket object
//     const ticket = new Ticket({
//       userId,
//       ticketToken: uuidv4(),
//       source,
//       destination,
//       via: viaStation ? [viaStation] : [],
//       price,
//       issuedAt: new Date(),
//       expiredAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1-hour validity
//     });

//     await ticket.save();

//     res.status(200).json({
//       success: true,
//       message: "Ticket purchased successfully.",
//       ticket,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error purchasing ticket.",
//       error: error.message,
//     });
//   }
// };

// // Schedule the updateExpiredTickets function to run every 1 minute
// setInterval(updateExpiredTickets, 60 * 1000);  // Run every 1 minute

// export default buyTicket;


import { v4 as uuidv4 } from "uuid";
import { Ticket } from "../models/ticket.model.js";
import { metroData } from "../helper/metroData.js";
import { redis } from "../server.js";  // Redis client

// Function to update expired tickets (Optional)
const updateExpiredTickets = async () => {
  try {
    const currentTime = new Date();
    const expiredTickets = await Ticket.find({
      expiredAt: { $lte: currentTime },
      status: "Active",
    });

    for (let ticket of expiredTickets) {
      ticket.status = "Expired";
      await ticket.save();
    }
  } catch (error) {
    console.error("Error updating expired tickets:", error.message);
  }
};


const buyTicket = async (req, res) => {
  const { source, destination } = req.body;
  const userId = req.user ? req.user._id : null;

  if (!source || !destination) {
    return res.status(400).json({
      success: false,
      message: "Source and destination are required.",
    });
  }

  try {
    const sourceLine = metroData.lines.find((line) =>
      line.stations.includes(source)
    );
    const destinationLine = metroData.lines.find((line) =>
      line.stations.includes(destination)
    );

    if (!sourceLine || !destinationLine) {
      return res.status(400).json({
        success: false,
        message: "Invalid source or destination.",
      });
    }

    let viaStation = null;
    let totalDistance = 0;

    if (sourceLine.line !== destinationLine.line) {
      const commonStations = sourceLine.stations.filter((station) =>
        destinationLine.stations.includes(station)
      );

      if (commonStations.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "No valid interchange station exists between the selected lines.",
        });
      }

      viaStation = commonStations[0];
      const sourceIndex = sourceLine.stations.indexOf(source);
      const viaIndexSource = sourceLine.stations.indexOf(viaStation);
      const viaIndexDestination = destinationLine.stations.indexOf(viaStation);
      const destinationIndex = destinationLine.stations.indexOf(destination);

      totalDistance =
        Math.abs(viaIndexSource - sourceIndex) +
        Math.abs(destinationIndex - viaIndexDestination);
    } else {
      const sourceIndex = sourceLine.stations.indexOf(source);
      const destinationIndex = sourceLine.stations.indexOf(destination);
      totalDistance = Math.abs(destinationIndex - sourceIndex);
    }

    const price = totalDistance * 10;

    const ticket = new Ticket({
      userId,
      ticketToken: uuidv4(),
      source,
      destination,
      via: viaStation ? [viaStation] : [],
      price,
      issuedAt: new Date(),
      expiredAt: new Date(Date.now() + 1 * 60 * 60 * 1000), 
    });

    await ticket.save();

    
    await redis.del(`tickets:${userId}`);

   
    const updatedTickets = await Ticket.find({ userId }).sort({ date: -1 });
    await redis.setex(`tickets:${userId}`, 60, JSON.stringify(updatedTickets));

    res.status(200).json({
      success: true,
      message: "Ticket purchased successfully.",
      ticket,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error purchasing ticket.",
      error: error.message,
    });
  }
};


setInterval(updateExpiredTickets, 60 * 1000);  

export default buyTicket;
