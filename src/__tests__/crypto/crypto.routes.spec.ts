import { cryptoRouter } from "#routes/crypto.routes";
import express from "express";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import request from "supertest";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";

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

describe("Crypto Routes - /encrypt (integration)", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cryptoRouter);
  });

  it.each(encryptionCases)("should $name -> $expectedStatus", async (fixture) => {
    const res = await request(app)
      .post("/encrypt")
      .send(fixture.input)
      .expect(fixture.expectedStatus ?? 200);

    if ((fixture.expectedStatus ?? 200) === 200) {
      expect(res.body).toEqual(fixture.expectedEncryptedValue);
    }
  });
});

describe("Crypto Routes - /decrypt (integration)", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cryptoRouter);
  });

  it.each(decryptionCases)("should $name -> $expectedStatus", async (fixture) => {
    const res = await request(app)
      .post("/decrypt")
      .send(fixture.input)
      .expect(fixture.expectedStatus ?? 200);

    if ((fixture.expectedStatus ?? 200) === 200) {
      expect(res.body).toEqual(fixture.expectedDecryptedValue);
    }
  });
});
