import type { Server } from "http";

import { cryptoRouter } from "#routes/crypto.routes";
import express from "express";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const encryptionCasesPath = join(__dirname, "fixtures", "encryption-cases.json");
const decryptionCasesPath = join(__dirname, "fixtures", "decryption-cases.json");

const encryptionCases: {
  description: string;
  expectedEncryptedValue: Record<string, string>;
  expectedStatus?: number;
  input: Record<string, any>;
  name: string;
}[] = JSON.parse(readFileSync(encryptionCasesPath, "utf-8"));

const decryptionCases: {
  description: string;
  expectedDecryptedValue: Record<string, any>;
  expectedStatus?: number;
  input: Record<string, any>;
  name: string;
}[] = JSON.parse(readFileSync(decryptionCasesPath, "utf-8"));

let app: express.Express;
let server: Server;
let baseUrl: string;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use(cryptoRouter);
  server = app.listen(0);
  const addr = server.address();
  const port = typeof addr === "object" && addr ? addr.port : 0;
  baseUrl = `http://127.0.0.1:${String(port)}`;
});

afterAll(() => {
  server.close();
});

describe("Crypto Routes - /encrypt (integration)", () => {
  it.each(encryptionCases)("should $name -> $expectedStatus", async (fixture) => {
    const res = await fetch(`${baseUrl}/encrypt`, {
      body: JSON.stringify(fixture.input),
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    const expectedStatus = fixture.expectedStatus ?? 200;
    expect(res.status).toBe(expectedStatus);

    if (expectedStatus === 200) {
      const json = (await res.json()) as any;
      expect(json).toHaveProperty("success", true);
      expect(json).toHaveProperty("data");
      expect(json.data).toEqual(fixture.expectedEncryptedValue);
    }
  });
});

describe("Crypto Routes - /decrypt (integration)", () => {
  it.each(decryptionCases)("should $name -> $expectedStatus", async (fixture) => {
    const res = await fetch(`${baseUrl}/decrypt`, {
      body: JSON.stringify(fixture.input),
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    const expectedStatus = fixture.expectedStatus ?? 200;
    expect(res.status).toBe(expectedStatus);

    if (expectedStatus === 200) {
      const json = (await res.json()) as any;
      expect(json).toHaveProperty("success", true);
      expect(json).toHaveProperty("data");
      expect(json.data).toEqual(fixture.expectedDecryptedValue);
    }
  });
});
