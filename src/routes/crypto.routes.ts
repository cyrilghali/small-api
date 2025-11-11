import { cryptoService } from "#config/crypto.config";
import { HTTP_STATUS } from "#constants/http-status";
import { validatePayload } from "#middlewares/validate-payload.middleware";
import { sendError, sendSuccess } from "#utils/response.utils";
import { withErrorHandling } from "#utils/route-handler";
import { Request, Response, Router } from "express";

const MAX_PAYLOAD_SIZE = 100 * 1024; // 100KB

export const cryptoRouter = Router();

cryptoRouter.post(
  "/encrypt",
  validatePayload,
  withErrorHandling((req: Request, res: Response) => {
    const payloadSize = JSON.stringify(req.body).length;
    if (payloadSize > MAX_PAYLOAD_SIZE) {
      const sizeMB = String(MAX_PAYLOAD_SIZE / (1024 * 1024));
      sendError(res, `Payload exceeds maximum size of ${sizeMB}MB`, HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const encrypted = cryptoService.encrypt(req.body as Record<string, any>);
    sendSuccess(res, encrypted, HTTP_STATUS.OK);
  }),
);

cryptoRouter.post(
  "/decrypt",
  validatePayload,
  withErrorHandling((req: Request, res: Response) => {
    const payloadSize = JSON.stringify(req.body).length;
    if (payloadSize > MAX_PAYLOAD_SIZE) {
      const sizeMB = String(MAX_PAYLOAD_SIZE / (1024 * 1024));
      sendError(res, `Payload exceeds maximum size of ${sizeMB}MB`, HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const decrypted = cryptoService.decrypt(req.body as Record<string, any>);
    sendSuccess(res, decrypted, HTTP_STATUS.OK);
  }),
);
