import Mission from "../models/Mission.js";
import Emergency from "../models/Emergency.js";
import Vehicle from "../models/Vehicle.js";
import ExpressError from "../middlewares/expressError.js";

export const createMission = async (data) => {
  const emergency = await Emergency.findById(data.emergencyId);
  if (!emergency) {
    throw new ExpressError(404, "Emergency not found");
  }

  if (emergency.status !== "pending") {
    throw new ExpressError(
      400,
      "Mission can be created only for pending emergencies"
    );
  }

  const mission = new Mission({
    emergencyId: data.emergencyId,
    rescueTeamId: data.rescueTeamId,
    vehiclesAssigned: data.vehiclesAssigned || [],
    route: data.route,
    eta: data.eta,
  });

  await mission.save();

  emergency.status = "assigned";
  emergency.assignedMissionId = mission._id;
  await emergency.save();

  if (data.vehiclesAssigned && data.vehiclesAssigned.length > 0) {
    await Vehicle.updateMany(
      { _id: { $in: data.vehiclesAssigned } },
      {
        status: "in-use",
        assignedMissionId: mission._id,
      }
    );
  }

  return mission;
};

export const getRescueMissions = async (rescueUserId) => {
  const missions = await Mission.find({ rescueTeamId: rescueUserId })
    .populate("emergencyId")
    .sort({ createdAt: -1 });

  return missions;
};

export const updateMissionStatus = async (missionId, status) => {
  const mission = await Mission.findById(missionId);
  if (!mission) {
    throw new ExpressError(404, "Mission not found");
  }

  mission.status = status;

  if (status === "enroute") {
    mission.startedAt = new Date();
  }

  if (status === "completed") {
    mission.completedAt = new Date();

    await Emergency.findByIdAndUpdate(mission.emergencyId, {
      status: "resolved",
    });

    await Vehicle.updateMany(
      { assignedMissionId: mission._id },
      { status: "available", assignedMissionId: null }
    );
  }

  await mission.save();
  return mission;
};
