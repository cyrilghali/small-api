import { CryptoService } from "#services/crypto.service";
import { Base64CryptoStrategy } from "#strategies/implementations/base64-crypto.strategy";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const encryptionCasesPath = join(__dirname, "fixtures", "encryption-cases.json");
const decryptionCasesPath = join(__dirname, "fixtures", "decryption-cases.json");

const encryptionCases = JSON.parse(readFileSync(encryptionCasesPath, "utf-8"));
const decryptionCases = JSON.parse(readFileSync(decryptionCasesPath, "utf-8"));

const cryptoStrategy = new Base64CryptoStrategy();
const cryptoService = new CryptoService(cryptoStrategy);

describe("Encryption", () => {
  encryptionCases.forEach(
    (fixture: { description: string; expectedEncryptedValue: Record<string, string>; input: Record<string, any>; name: string }) => {
      it(`should ${fixture.name}`, () => {
        const result = cryptoService.encrypt(fixture.input);
        expect(result).toEqual(fixture.expectedEncryptedValue);
      });

      it(`should have consistent encoding for ${fixture.name}`, () => {
        const result1 = cryptoService.encrypt(fixture.input);
        const result2 = cryptoService.encrypt(fixture.input);
        expect(result1).toEqual(result2);
      });
    },
  );
});

describe("Decryption", () => {
  decryptionCases.forEach(
    (fixture: { description: string; expectedDecryptedValue: Record<string, any>; input: Record<string, any>; name: string }) => {
      it(`should ${fixture.name}`, () => {
        const result = cryptoService.decrypt(fixture.input);
        expect(result).toEqual(fixture.expectedDecryptedValue);
      });

      it(`should have consistent decoding for ${fixture.name}`, () => {
        const result1 = cryptoService.decrypt(fixture.input);
        const result2 = cryptoService.decrypt(fixture.input);
        expect(result1).toEqual(result2);
      });
    },
  );
});

describe("Round-trip Encryption-Decryption", () => {
  encryptionCases.forEach(
    (fixture: { description: string; expectedEncryptedValue: Record<string, string>; input: Record<string, any>; name: string }) => {
      it(`should successfully encrypt then decrypt ${fixture.name}`, () => {
        const encrypted = cryptoService.encrypt(fixture.input);
        const decrypted = cryptoService.decrypt(encrypted);
        expect(decrypted).toEqual(fixture.input);
      });
    },
  );
});
