import { signatureRouter } from "#routes/signature.routes";
import express from "express";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import request from "supertest";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";

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

describe("Signature Routes - /verify (integration)", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(signatureRouter);
  });

  it.each(verifyCases)("should $name -> $expectedStatus", async (fixture) => {
    process.env.SIGNATURE_SECRET = fixture.secret;

    const body = { data: fixture.data, signature: fixture.signature as any };

    const expectedStatus = fixture.expectedStatus ?? (fixture.expectedResult ? 204 : 400);
    const res = await request(app).post("/verify").send(body).expect(expectedStatus);

    if (expectedStatus === 204) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      expect(res.text === undefined || res.text === "").toBe(true);
    }

    if (expectedStatus >= 400 && expectedStatus < 500) {
      expect(res.body).toHaveProperty("message");
    }
  });
});

describe("Signature Routes - /sign (integration)", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(signatureRouter);
  });

  it.each(signCases)("should $name", async (fixture) => {
    process.env.SIGNATURE_SECRET = fixture.secret;

    const res = await request(app).post("/sign").send(fixture.input).expect(200);

    expect(res.body).toHaveProperty("signature");
    expect(typeof res.body.signature).toBe("string");
    expect(res.body.signature as string).toMatch(/^[a-f0-9]{64}$/);
  });
});
