// import mongoose from 'mongoose';

// const ticketSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User'
//     },
//     source: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     destination: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     price: {
//         type: Number,
//         required: true,
//         min: 0,
//     },
//     issuedAt: {
//         type: Date,
//         default: Date.now, 
//     },
//     expiresAt: {
//         type: Date,
//         default: function () {
            
//             return new Date(this.issuedAt.getTime() + 60 * 60 * 1000);
//         },
//     },
//     status: {
//         type: String,
//         enum: ['Active', 'In Journey', 'Completed'], 
//         default: 'Active',
//     },
//     ticketToken: {
//         type: String,
//         unique: true,
//         required: true,
//     },
//     via: {
//         type: [String], // Array of station names
//         default: [], // Optional, can be empty
//       },
// }, {
//     timestamps: true,
// });


// ticketSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


// ticketSchema.pre('save', function (next) {
//     if (!this.ticketToken) {
//         this.ticketToken = `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
//     }
//     next();
// });

// export const Ticket = mongoose.model('Ticket', ticketSchema);
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ticketToken: {
    type: String,
    required: true,
    unique: true,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  via: {
    type: [String], // Array of station names
    default: [], // Optional, can be empty
  },
  price: {
    type: Number,
    required: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Expired", "In Journey", "Completed"],
    default: "Active",
  },
});

export const Ticket = mongoose.model("Ticket", ticketSchema);