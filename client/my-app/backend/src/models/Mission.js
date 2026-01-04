import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
    emergencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emergency',
        required: true
    },
    rescueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    leaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    vehiclesAssigned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    }],
    route: {
        type: mongoose.Schema.Types.Mixed
    },
    status: {
        type: String,
        default: 'pending'
    },
    eta: {
        type: Date
    },
    startedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('Mission', mongoose.Schema);