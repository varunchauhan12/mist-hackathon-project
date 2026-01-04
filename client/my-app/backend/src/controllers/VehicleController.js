import Vehicle from "../models/Vehicle.js"; 

// Create a new vehicle
// POST /api/vehicles
export const createVehicle = async (req, res) => {
    try {
        const { type , identifier, location, capacity, status } = req.body;

        // Check if vehicle with identifier already exists
        const existingVehicle = await Vehicle.findOne({ identifier });
        if (existingVehicle) {
            return res.status(400).json({ message: "Vehicle identifier must be unique." });
        }
        const vehicle = new Vehicle({
            type,
            identifier,
            location,
            capacity,
            status,
        });
        const savedVehicle = await vehicle.save();
        res.status(201).json(savedVehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all vehicles
// GET /api/vehicles?status=available
export const getAllVehicles = async (req, res) => {
    try {
        const { status, type } = req.query;
        let query = {};
        if (status) query.status = status;
        if (type) query.type = type;
        const vehicles = await Vehicle.find(query);
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single vehicle by ID
// GET /api/vehicles/:id
export const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate("assignedMissionId");
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update vehicle details
// PATCH /api/vehicles/:id
export const updateVehicle = async (req, res) => {
    try {
        const { location, status, assignedMissionId } = req.body;

        // Construct update object to prevent overwriting identifier/type unless intended
        const updateData = {};
        if (location) updateData.location = location;
        if (status) updateData.status = status;
        if (assignedMissionId !== undefined) updateData.assignedMissionId = assignedMissionId;
        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a vehicle
// DELETE /api/vehicles/:id
export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};