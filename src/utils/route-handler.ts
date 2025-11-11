import { ERROR_MESSAGES } from "#constants/error-messages";
import { HTTP_STATUS } from "#constants/http-status";
import { sendError } from "#utils/response.utils";
import { Request, Response } from "express";

/**
 * Higher-order function that wraps route handlers with error handling
 * Eliminates boilerplate try-catch blocks
 */
export const withErrorHandling = (handler: (req: Request, res: Response) => Promise<void> | void) => async (req: Request, res: Response) => {
  try {
    await handler(req, res);
  } catch {
    sendError(res, ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
