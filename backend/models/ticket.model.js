import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    source: {
        type: String,
        required: true,
        trim: true,
    },
    destination: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    issuedAt: {
        type: Date,
        default: Date.now, 
    },
    expiresAt: {
        type: Date,
        default: function () {
            
            return new Date(this.issuedAt.getTime() + 1 * 60 * 1000);
        },
    },
    status: {
        type: String,
        enum: ['Active', 'In-journey', 'Completed'], 
        default: 'Active',
    },
    ticketToken: {
        type: String,
        unique: true,
        required: true,
    },
}, {
    timestamps: true,
});


ticketSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


ticketSchema.pre('save', function (next) {
    if (!this.ticketToken) {
        this.ticketToken = `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    next();
});

export const Ticket = mongoose.model('Ticket', ticketSchema);
