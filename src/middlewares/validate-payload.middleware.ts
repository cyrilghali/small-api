import type { NextFunction, Request, Response } from "express";

import { ERROR_MESSAGES } from "#constants/error-messages";
import { HTTP_STATUS } from "#constants/http-status";

export function validatePayload(req: Request, res: Response, next: NextFunction): void {
  const payload = req.body;

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_PAYLOAD });
    return;
  }

  next();
}
