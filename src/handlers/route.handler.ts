import type { Request, Response } from "express";

import { ERROR_MESSAGES } from "#constants/error-messages.constants";
import { HTTP_STATUS } from "#constants/http-status.constants";

/**
 * Higher-order function that wraps route handlers with error handling
 * Eliminates boilerplate try-catch blocks
 */
export const withErrorHandling = (handler: (req: Request, res: Response) => Promise<void> | void) => async (req: Request, res: Response) => {
  try {
    await handler(req, res);
  } catch {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_ERROR });
  }
};
