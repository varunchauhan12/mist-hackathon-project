import mongoose from "mongoose";

const logisticsProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorityLevel: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    regionAssigned: [{
        type: String
    }],
    canRunSimulation: {
        type: Boolean,
        default: false
    },
    canReallocateResources: {
        type: Boolean,
        default: false
    },
    lastSimulationRun: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('LogisticsProfile', logisticsProfileSchema);