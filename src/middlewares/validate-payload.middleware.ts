import { ERROR_MESSAGES } from "#constants/error-messages";
import { HTTP_STATUS } from "#constants/http-status";
import { sendError } from "#utils/response.utils";
import { NextFunction, Request, Response } from "express";

export function validatePayload(req: Request, res: Response, next: NextFunction): void {
  const payload = req.body;

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    sendError(res, ERROR_MESSAGES.INVALID_PAYLOAD, HTTP_STATUS.BAD_REQUEST);
    return;
  }

  next();
}
