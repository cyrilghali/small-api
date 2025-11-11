import type { Server } from "http";

import { signatureRouter } from "#routes/signature.routes";
import express from "express";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const verifyCasesPath = join(__dirname, "fixtures", "verify-cases.json");
const signCasesPath = join(__dirname, "fixtures", "sign-cases.json");

const verifyCases: {
  data: Record<string, any>;
  description: string;
  expectedResult: boolean;
  expectedStatus?: number;
  name: string;
  secret: string;
  signature: null | string;
}[] = JSON.parse(readFileSync(verifyCasesPath, "utf-8"));

const signCases: {
  description: string;
  input: Record<string, any>;
  name: string;
  secret: string;
}[] = JSON.parse(readFileSync(signCasesPath, "utf-8"));

let app: express.Express;
let server: Server;
let baseUrl: string;

beforeAll(() => {
  app = express();
  app.use(express.json());
  // Mount at root so routes are /sign and /verify
  app.use(signatureRouter);
  server = app.listen(0);
  const addr = server.address();
  const port = typeof addr === "object" && addr ? addr.port : 0;
  baseUrl = `http://127.0.0.1:${String(port)}`;
});

afterAll(() => {
  server.close();
});

describe("Signature Routes - /verify (integration)", () => {
  it.each(verifyCases)("should $name -> $expectedStatus", async (fixture) => {
    process.env.SIGNATURE_SECRET = fixture.secret;

    const body = { data: fixture.data, signature: fixture.signature as any };

    const res = await fetch(`${baseUrl}/verify`, {
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    const expectedStatus = fixture.expectedStatus ?? (fixture.expectedResult ? 204 : 400);
    expect(res.status).toBe(expectedStatus);

    if (expectedStatus === 204) {
      const text = await res.text();
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      expect(text === undefined || text === "").toBe(true);
    }

    if (expectedStatus >= 400 && expectedStatus < 500) {
      const json = (await res.json()) as any;
      expect(json).toHaveProperty("success", false);
      expect(json).toHaveProperty("error");
    }
  });
});

describe("Signature Routes - /sign (integration)", () => {
  it.each(signCases)("should $name", async (fixture) => {
    process.env.SIGNATURE_SECRET = fixture.secret;

    const res = await fetch(`${baseUrl}/sign`, {
      body: JSON.stringify(fixture.input),
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json).toHaveProperty("success", true);
    expect(json).toHaveProperty("data.signature");
    expect(typeof json.data.signature).toBe("string");
    expect(json.data.signature as string).toMatch(/^[a-f0-9]{64}$/);
  });
});
