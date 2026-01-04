import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    identifier: {
        type: String,
        required: true
    },
    location: {
        lat: Number,
        lng: Number
    },
    capacity: {
        type: Number
    },
    status: {
        type: String,
        enum: ['available', 'in-use', 'down'],
        default: 'available'
    },
    assignedMissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mission'
    }
}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema);