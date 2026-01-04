import Joi from "joi";

export const userSignUpSchema = Joi.object({
  fullName: Joi.string().min(3).max(100).trim().required().messages({
    "string.min": "Full name must be at least 3 characters",
    "string.max": "Full name must be at most 100 characters",
    "any.required": "Full name is required",
  }),

  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),

  role: Joi.string()
    .valid("victim", "rescue", "logistics")
    .lowercase()
    .default("victim")
    .messages({
      "any.only": "Role must be victim, rescue, or logistics",
    }),
}).options({ abortEarly: false });

export const userLoginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
}).options({ abortEarly: false }); // users gets all the validation errors at once
