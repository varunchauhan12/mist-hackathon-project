import SafeZone from "../models/SafeZone.js";

// Create a new Safe Zone
// POST /api/safe-zones
export const createSafeZone = async (req, res) => {
    const { name, location, capacity, facilities, status } = req.body;

    // Add the creator as the last updater
    const newZone = await SafeZone.create({
        name,
        location,
        capacity,
        facilities,
        status,
        lastUpdatedBy: req.user._id,
    });

    res.status(201).json({
        success: true,
        data: newZone,
    });
};

// Get all Safe Zones (with optional status filter)
// GET /api/safe-zones?status=safe
export const getAllSafeZones = async (req, res) => {
    const { status } = req.query;

    // Build query object
    let query = {};
    if (status) {
        query.status = status;
    }

    const zones = await SafeZone.find(query).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: zones.length,
        data: zones,
    });
};

// Get single Safe Zone
// GET /api/safe-zones/:id
export const getSafeZoneById = async (req, res) => {
    const zone = await SafeZone.findById(req.params.id).populate(
        "lastUpdatedBy",
        "fullName email role"
    );

    if (!zone) {
        throw new Error("Safe Zone not found"); // wrapAsync will catch this
    }

    res.status(200).json({
        success: true,
        data: zone,
    });
};

// Update Safe Zone
// PUT /api/safe-zones/:id
export const updateSafeZone = async (req, res) => {
    let zone = await SafeZone.findById(req.params.id);

    if (!zone) {
        throw new Error("Safe Zone not found");
    }

    // Update fields
    const updates = { ...req.body };

    // Force update the 'lastUpdatedBy' field
    updates.lastUpdatedBy = req.user._id;

    // Manual check for capacity vs occupancy if both are present in update
    if (updates.currentOccupancy && updates.capacity) {
        if (updates.currentOccupancy > updates.capacity) {
            throw new Error("Occupancy cannot exceed capacity");
        }
    }

    zone = await SafeZone.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: zone,
    });
};

//    Delete Safe Zone
//    DELETE /api/safe-zones/:id
export const deleteSafeZone = async (req, res) => {
    const zone = await SafeZone.findById(req.params.id);
    if (!zone) {
        throw new Error("Safe Zone not found");
    }
    await zone.deleteOne();
    res.status(200).json({
        success: true,
        message: "Safe Zone deleted successfully",
    });
};