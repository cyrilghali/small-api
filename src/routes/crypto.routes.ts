import type { Request, Response } from "express";

import { HTTP_STATUS } from "#constants/http-status";
import { validatePayload } from "#middlewares/validate-payload.middleware";
import { CryptoService } from "#services/crypto.service";
import { Base64CryptoStrategy } from "#strategies/implementations/base64-crypto.strategy";
import { withErrorHandling } from "#utils/route-handler";
import { Router } from "express";

const cryptoService = new CryptoService(new Base64CryptoStrategy());
export const cryptoRouter = Router();

cryptoRouter.post(
  "/encrypt",
  validatePayload,
  withErrorHandling((req: Request, res: Response) => {
    const encrypted = cryptoService.encrypt(req.body as Record<string, any>);
    res.status(HTTP_STATUS.OK).json(encrypted);
  }),
);

cryptoRouter.post(
  "/decrypt",
  validatePayload,
  withErrorHandling((req: Request, res: Response) => {
    const decrypted = cryptoService.decrypt(req.body as Record<string, any>);
    res.status(HTTP_STATUS.OK).json(decrypted);
  }),
);
