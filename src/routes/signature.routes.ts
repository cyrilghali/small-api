import { getSignatureSecret } from "#config/env.config";
import { signatureService } from "#config/signature.config";
import { ERROR_MESSAGES } from "#constants/error-messages";
import { HTTP_STATUS } from "#constants/http-status";
import { validatePayload } from "#middlewares/validate-payload.middleware";
import { signPayloadSchema, verifySignatureSchema } from "#schemas/signature.schema";
import { sendError, sendSuccess } from "#utils/response.utils";
import { withErrorHandling } from "#utils/route-handler";
import { Request, Response, Router } from "express";

const MAX_PAYLOAD_SIZE = 100 * 1024; // 100KB

export const signatureRouter = Router();

signatureRouter.post(
  "/sign",
  validatePayload,
  withErrorHandling((req: Request, res: Response) => {
    const { error, value } = signPayloadSchema.validate(req.body);

    if (error) {
      sendError(res, error.details[0]?.message || "", HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const payloadSize = JSON.stringify(value).length;
    if (payloadSize > MAX_PAYLOAD_SIZE) {
      const sizeMB = String(MAX_PAYLOAD_SIZE / (1024 * 1024));
      sendError(res, `Payload exceeds maximum size of ${sizeMB}MB`, HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const secret = getSignatureSecret();
    const result = signatureService.sign(value, secret);

    if (result.ok) {
      sendSuccess(res, { signature: result.value }, HTTP_STATUS.OK);
    } else {
      sendError(res, result.error, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }),
);

signatureRouter.post(
  "/verify",
  validatePayload,
  withErrorHandling((req: Request, res: Response) => {
    const payloadSize = JSON.stringify(req.body).length;
    if (payloadSize > MAX_PAYLOAD_SIZE) {
      const sizeMB = String(MAX_PAYLOAD_SIZE / (1024 * 1024));
      sendError(res, `Payload exceeds maximum size of ${sizeMB}MB`, HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const { error, value } = verifySignatureSchema.validate(req.body);

    if (error) {
      sendError(res, error.details[0]?.message || "", HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const secret = getSignatureSecret();
    const result = signatureService.verify(value.data, value.signature, secret);

    if (result.ok) {
      if (result.value) {
        res.status(HTTP_STATUS.NO_CONTENT).send();
      } else {
        sendError(res, ERROR_MESSAGES.INVALID_SIGNATURE, HTTP_STATUS.BAD_REQUEST);
      }
    } else {
      sendError(res, result.error, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }),
);
