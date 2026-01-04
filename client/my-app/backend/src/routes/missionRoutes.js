import express from "express";
import { wrapAsync } from "../middlewares/wrapAsync.js";
import { userAuth, authorize } from "../middlewares/authMiddleware.js";
import { validateCreateMission } from "../middlewares/validate.js";

import {
  createMission,
  fetchRescueMissions,
  changeMissionStatus,
} from "../controllers/missionController.js";

const router = express.Router();

/*Logistics*/
router.post(
  "/",
  userAuth,
  authorize(["logistics"]),
  validateCreateMission,
  wrapAsync(createMission)
);

/* Rescue */
router.get(
  "/my",
  userAuth,
  authorize(["rescue"]),
  wrapAsync(fetchRescueMissions)
);

/* Rescue → update mission status */
router.patch(
  "/:id/status",
  userAuth,
  authorize(["rescue"]),
  wrapAsync(changeMissionStatus)
);

export default router;
