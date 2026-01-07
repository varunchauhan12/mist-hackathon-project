import Emergency from "../models/Emergency.js";
import ExpressError from "../middlewares/expressError.js";
import {decisionEngine} from "../engine/decisionEngine.js";
import {EVENTS} from "../constants/events.js";

export const createEmergency = async (userId, data , io) => {
  const emergency = await Emergency.create({
    reportedBy: userId,
    type: data.type,
    location: data.location,
    description: data.description,
    media: data.media || [],
    severity: data.severity,
  });

  await decisionEngine({
    eventType: EVENTS.EMERGENCY_REPORTED,
    payload: {
      emergencyId: emergency._id,
      location: emergency.location,
      severity: emergency.severity,
      type: emergency.type,
      message: "New emergency reported",
    },
    context: { userId },
    io,
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

export const updateEmergencyStatus = async (id, status,io) => {
  const emergency = await Emergency.findById(id);
  if (!emergency) {
    throw new ExpressError(404, "Emergency not found");
  }
  emergency.status = status;
  await emergency.save();

  await decisionEngine({
    eventType: EVENTS.EMERGENCY_UPDATED,
    payload: {
      emergencyId: emergency._id,
      severity: emergency.severity,
      message: "Emergency updated",
    },
    io,
  });

  return emergency;
};
