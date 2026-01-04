import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema({
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        required: true
    },
    location: {
        lat: Number,
        lng: Number,
        address: String
    },
    description: {
        type: String
    },
    media: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['pending', 'assigned', 'resolved'],
        default: 'pending'
    },
    assignedMissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mission'
    },
    verificationScore: {
        type: Number,
        default: 0
    },
    verifiedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

export default mongoose.model('Emergency', emergencySchema);