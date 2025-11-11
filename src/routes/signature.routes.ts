import { signatureService } from "#config/signature.config";
import { ERROR_MESSAGES } from "#constants/error-messages";
import { HTTP_STATUS } from "#constants/http-status";
import { validatePayload } from "#middlewares/validate-payload.middleware";
import { verifySignatureSchema } from "#schemas/signature.schema";
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
    const { error, value } = verifySignatureSchema.validate(req.body);

    if (error) {
      const message = error.details[0]?.message || ERROR_MESSAGES.INTERNAL_ERROR;
      sendError(res, message, HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const secret = process.env.SIGNATURE_SECRET ?? "default-secret";
    const isValid = signatureService.verify(value.data, value.signature, secret);

    if (!isValid) {
      sendError(res, "Invalid signature", HTTP_STATUS.BAD_REQUEST);
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch {
    sendError(res, ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
});
