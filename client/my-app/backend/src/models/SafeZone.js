import mongoose from "mongoose";

const safeZoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        lat: Number,
        lng: Number,
        address: String
    },
    capacity: {
        type: Number,
        required: true
    },
    currentOccupancy: {
        type: Number,
        default: 0
    },
    facilities: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['safe', 'warning', 'unsafe'],
        default: 'safe'
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

export default mongoose.model('SafeZone', safeZoneSchema);