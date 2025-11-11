import { signatureService } from "#config/signature.config";
import { ERROR_MESSAGES } from "#constants/error-messages";
import { HTTP_STATUS } from "#constants/http-status";
import { validatePayload } from "#middlewares/validate-payload.middleware";
import { sendError, sendSuccess } from "#utils/response.utils";
import { Router } from "express";

export const signatureRouter = Router();

signatureRouter.use(validatePayload);

signatureRouter.post("/sign", (req, res) => {
  try {
    const secret = process.env.SIGNATURE_SECRET ?? "default-secret";
    const signature = signatureService.sign(req.body, secret);
    sendSuccess(res, { signature }, HTTP_STATUS.OK);
  } catch {
    sendError(res, ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
});

signatureRouter.post("/verify", (req, res) => {
  try {
    const secret = process.env.SIGNATURE_SECRET ?? "default-secret";
    const signature = req.body.signature;
    const isValid = signatureService.verify(req.body, signature, secret);
    sendSuccess(res, { valid: isValid }, HTTP_STATUS.OK);
  } catch {
    sendError(res, ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
});
