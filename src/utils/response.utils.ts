import type { ApiErrorResponse } from "#types/api-response.types";
import type { Response } from "express";

/**
 * Send an error response
 */
export function sendError(res: Response, message: string, statusCode = 500, code?: string): void {
  const response: ApiErrorResponse = {
    message,
    ...(code && { code }),
  };
  res.status(statusCode).json(response);
}

/**
 * Send a success response with data
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters, @typescript-eslint/no-inferrable-types
export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200): void {
  res.status(statusCode).json(data);
}
