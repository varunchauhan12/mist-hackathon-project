import Emergency from "../models/Emergency.js";
import ExpressError from "../middlewares/expressError.js";

export const createEmergency = async (userId, data) => {
  const emergency = await Emergency.create({
    reportedBy: userId,
    type: data.type,
    location: data.location,
    description: data.description,
    media: data.media || [],
    severity: data.severity,
  });

  return emergency;
};

export const getVictimEmergencies = async (userId) => {
  const emergencies = await Emergency.find({ reportedBy: userId }).sort({
    createdAt: -1,
  });
  return emergencies;
};

export const getAllEmergencies = async () => {
  const emergencies = await Emergency.find().sort({ createdAt: -1 });
  return emergencies;
};

export const updateEmergencyStatus = async (id, status) => {
  const emergency = await Emergency.findById(id);
  if (!emergency) {
    throw new ExpressError(404, "Emergency not found");
  }
  emergency.status = status;
  await emergency.save();
  return emergency;
};
