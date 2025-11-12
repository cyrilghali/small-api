import type { Request, Response } from "express";

import { getSignatureSecret } from "#config/env.config";
import { ERROR_MESSAGES } from "#constants/error-messages";
import { HTTP_STATUS } from "#constants/http-status";
import { validatePayload } from "#middlewares/validate-payload.middleware";
import { signPayloadSchema, verifySignatureSchema } from "#schemas/signature.schema";
import { SignatureService } from "#services/signature.service";
import { HmacSignatureStrategy } from "#strategies/implementations/hmac-signature.strategy";
import { withErrorHandling } from "#utils/route-handler";
import { Router } from "express";

const signatureService = new SignatureService(new HmacSignatureStrategy());
export const signatureRouter = Router();

signatureRouter.post(
  "/sign",
  validatePayload,
  withErrorHandling((req: Request, res: Response) => {
    const { error, value } = signPayloadSchema.validate(req.body);

    if (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.details[0]?.message || "" });
      return;
    }
    const secret = getSignatureSecret();
    const result = signatureService.sign(value, secret);

    if (result.ok) res.status(HTTP_STATUS.OK).json({ signature: result.value });
    else res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: result.error });
  }),
);

signatureRouter.post(
  "/verify",
  validatePayload,
  withErrorHandling((req: Request, res: Response) => {
    const { error, value } = verifySignatureSchema.validate(req.body);

    if (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.details[0]?.message || "" });
      return;
    }

    const secret = getSignatureSecret();
    const result = signatureService.verify(value.data, value.signature, secret);

    if (!result.ok) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: result.error });
      return;
    }

    if (!result.value) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_SIGNATURE });
      return;
    }

    res.status(HTTP_STATUS.NO_CONTENT).send();
  }),
);
