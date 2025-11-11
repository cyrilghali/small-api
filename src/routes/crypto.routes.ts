import { cryptoService } from "#config/crypto.config";
import { HTTP_STATUS } from "#constants/http-status";
import { validatePayload } from "#middlewares/validate-payload.middleware";
import { sendSuccess } from "#utils/response.utils";
import { Request, Response, Router } from "express";

export const cryptoRouter = Router();

cryptoRouter.use(validatePayload);

cryptoRouter.post("/encrypt", (req: Request, res: Response) => {
  const encrypted = cryptoService.encrypt(req.body);
  sendSuccess(res, encrypted, HTTP_STATUS.OK);
});

cryptoRouter.post("/decrypt", (req: Request, res: Response) => {
  const decrypted = cryptoService.decrypt(req.body);
  sendSuccess(res, decrypted, HTTP_STATUS.OK);
});
