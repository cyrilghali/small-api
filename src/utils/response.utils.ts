import { ApiErrorResponse, ApiSuccessResponse } from "#types/api-response.types";
import { Response } from "express";

/**
 * Send a standardized error response
 */
export function sendError(res: Response, message: string, statusCode = 500, code?: string): void {
  const response: ApiErrorResponse = {
    error: {
      message,
      ...(code && { code }),
    },
    success: false,
  };
  res.status(statusCode).json(response);
}

/**
 * Send a standardized success response
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters, @typescript-eslint/no-inferrable-types
export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200): void {
  const response: ApiSuccessResponse<T> = {
    data,
    success: true,
  };
  res.status(statusCode).json(response);
}
