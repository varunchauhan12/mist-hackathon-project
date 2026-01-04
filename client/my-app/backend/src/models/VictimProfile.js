import mongoose from "mongoose"

const victimProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    emergencyCount: {
        type: Number,
        default: 0
    },
    lastEmergencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emergency'
    },
    dependentsCount: {
        type: Number,
        default: 0
    },
    medicalNotes: {
        type: String,
        required: false
    },
    isVolunteer: {
        type: Boolean,
        default: false
    },
    deviceInfo: {
        platform: String,
        appVersion: String
    }
}, { timestamps: true });

export default mongoose.model('VictimProfile', victimProfileSchema);