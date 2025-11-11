import Joi from "joi";

export const verifySignatureSchema = Joi.object({
  data: Joi.object().required().messages({
    "any.required": "data field is required",
    "object.base": "data must be an object",
  }),
  signature: Joi.string().hex().length(64).required().messages({
    "any.required": "signature field is required",
    "string.base": "signature must be a string",
    "string.hex": "signature must be a hexadecimal string",
    "string.length": "signature must be exactly 64 characters (256-bit SHA256 hash)",
  }),
}).unknown(false);
