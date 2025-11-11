import { ERROR_MESSAGES } from "#constants/error-messages";
import { HTTP_STATUS } from "#constants/http-status";
import { sendError } from "#utils/response.utils";
import { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  sendError(res, ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
}
