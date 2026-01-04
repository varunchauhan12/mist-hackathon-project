import mongoose from 'mongoose';

const rescueProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    organization: {
        type: String,
        enum: ['NDRF', 'Fire', 'NGO'],
        required: true
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    roleInTeam: {
        type: String,
        enum: ['leader', 'member'],
        default: 'member'
    },
    skills: [{
        type: String,
        enum: ['medical', 'diving', 'fire']
    }],
    availabilityStatus: {
        type: String,
        enum: ['available', 'on-mission', 'offline'],
        default: 'offline'
    },
    currentMissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mission'
    },
    shiftTimings: {
        type: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true });

export default mongoose.model('RescueProfile',mongoose.Schema);