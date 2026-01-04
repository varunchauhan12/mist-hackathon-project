import {
  userSignUpSchema,
  userLoginSchema,
  createEmergencySchema,
  createMissionSchema,
  createSafeZoneSchema,
  createVehicleSchema,
  createVictimProfileSchema,
} from "../Schema.js";

import ExpressError from "./expressError.js";

export const validateUserSignUp = (req, res, next) => {
  const { error } = userSignUpSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new ExpressError(
      400,
      error.details.map((err) => err.message).join(", ")
    );
  }

  next();
};

export const validateUserLogin = (req, res, next) => {
  const { error } = userLoginSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new ExpressError(
      400,
      error.details.map((err) => err.message).join(", ")
    );
  }

  next();
};

export const validateCreateEmergency = (req, res, next) => {
  const { error } = createEmergencySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new ExpressError(
      400,
      error.details.map((err) => err.message).join(", ")
    );
  }

  next();
};

export const validateCreateMission = (req, res, next) => {
  const { error } = createMissionSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new ExpressError(
      400,
      error.details.map((err) => err.message).join(", ")
    );
  }

  next();
};

export const validateCreateSafeZone = (req, res, next) => {
  const { error } = createSafeZoneSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new ExpressError(
      400,
      error.details.map((err) => err.message).join(", ")
    );
  }

  next();
};

export const validateCreateVehicle = (req, res, next) => {
  const { error } = createVehicleSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new ExpressError(
      400,
      error.details.map((err) => err.message).join(", ")
    );
  }

  next();
};

export const validateCreateVictimProfile = (req, res, next) => {
  const { error } = createVictimProfileSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new ExpressError(
      400,
      error.details.map((err) => err.message).join(", ")
    );
  }

  next();
};
