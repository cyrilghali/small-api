import type { JSONPayload } from "#types/payload.types";
import type { NextFunction, Request, Response } from "express";

import { ERROR_MESSAGES } from "#constants/error-messages.constants";
import { HTTP_STATUS } from "#constants/http-status.constants";

export function validatePayload(req: Request, res: Response, next: NextFunction): void {
  const payload = req.body as JSONPayload;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- req.body may be falsy at runtime even though typed as JSONPayload
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_PAYLOAD });
    return;
  }

  next();
}
