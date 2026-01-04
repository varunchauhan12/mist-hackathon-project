import { userSignUpSchema, userLoginSchema } from "../Schema.js";
import ExpressError from "./expressError.js";

export const validateUserSignUp = (req, res, next) => {
  const { error } = userSignUpSchema.validate(req.body);
  if (error) {
    throw new ExpressError(
      400,
      error.details.map((err) => err.message).join(", ")
    );
  }
  next();
};

export const validateUserLogin = (req, res, next) => {
  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    throw new ExpressError(
      400,
      error.details.map((err) => err.message).join(", ")
    );
  }
  next();
};
