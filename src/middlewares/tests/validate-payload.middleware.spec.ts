import type { Request, Response } from "express";

import { validatePayload } from "#middlewares/validate-payload.middleware";
import { describe, expect, it, vi } from "vitest";

describe("validatePayload Middleware", () => {
  it("should pass through valid JSON body", () => {
    const req = {
      body: { message: "hello" },
    } as Request;

    const res = {} as Response;
    const next = vi.fn();

    validatePayload(req, res, next);

    expect(next).toHaveResolved();
  });

  it("should reject array body", () => {
    const req = {
      body: [1, 2, 3],
    } as Request;

    const res = {
      status: vi.fn().mockReturnValue({ json: vi.fn() }),
    } as unknown as Response;
    const next = vi.fn();

    validatePayload(req, res, next);

    expect(res.status).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should reject undefined body", () => {
    const req = {
      body: undefined,
    } as Request;

    const res = {
      status: vi.fn().mockReturnValue({ json: vi.fn() }),
    } as unknown as Response;
    const next = vi.fn();

    validatePayload(req, res, next);

    expect(res.status).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should reject null body", () => {
    const req = {
      body: null,
    } as Request;

    const res = {
      status: vi.fn().mockReturnValue({ json: vi.fn() }),
    } as unknown as Response;
    const next = vi.fn();

    validatePayload(req, res, next);

    expect(res.status).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should reject string body", () => {
    const req = {
      body: "string value",
    } as Request;

    const res = {
      status: vi.fn().mockReturnValue({ json: vi.fn() }),
    } as unknown as Response;
    const next = vi.fn();

    validatePayload(req, res, next);

    expect(res.status).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should not modify request body", () => {
    const originalBody = { data: "value", nested: { key: "val" } };
    const req = {
      body: JSON.parse(JSON.stringify(originalBody)),
    } as Request;

    const res = {} as Response;
    const next = vi.fn();

    validatePayload(req, res, next);

    expect(req.body).toEqual(originalBody);
  });
});
