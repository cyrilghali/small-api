import type { NextFunction, Request, Response } from "express";

const colorReset = "\x1b[0m";
const colorGreen = "\x1b[32m";
const colorYellow = "\x1b[33m";
const colorRed = "\x1b[31m";
const colorGray = "\x1b[90m";

const getStatusColor = (status: number): string => {
  if (status >= 200 && status < 300) return colorGreen;
  if (status >= 400 && status < 500) return colorYellow;
  if (status >= 500) return colorRed;
  return colorGray;
};

const formatTimestamp = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const timestamp = formatTimestamp();
    const statusColor = getStatusColor(res.statusCode);
    const status = `${statusColor}${String(res.statusCode)}${colorReset}`;

    console.log(`${colorGray}[${timestamp}]${colorReset} ${req.method} ${req.path} :: ${status} ${colorGray}(${String(duration)}ms)${colorReset}`);
  });

  next();
}
