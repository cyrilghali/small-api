import { SignatureService } from "#services/signature.service";
import { HmacSignatureStrategy } from "#strategies/implementations/hmac-signature.strategy";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const signCasesPath = join(__dirname, "fixtures", "sign-cases.json");
const verifyCasesPath = join(__dirname, "fixtures", "verify-cases.json");

const signCases = JSON.parse(readFileSync(signCasesPath, "utf-8"));
const verifyCases = JSON.parse(readFileSync(verifyCasesPath, "utf-8"));

const signatureStrategy = new HmacSignatureStrategy();
const signatureService = new SignatureService(signatureStrategy);

describe("Signature - Sign", () => {
  signCases.forEach((fixture: { description: string; expectedSignature: string; input: Record<string, any>; name: string; secret: string }) => {
    it(`should ${fixture.name}`, () => {
      const result = signatureService.sign(fixture.input, fixture.secret);
      expect(result).toBe(fixture.expectedSignature);
    });

    it(`should have consistent signature for ${fixture.name}`, () => {
      const result1 = signatureService.sign(fixture.input, fixture.secret);
      const result2 = signatureService.sign(fixture.input, fixture.secret);
      expect(result1).toBe(result2);
    });
  });
});

describe("Signature - Verify", () => {
  verifyCases.forEach(
    (fixture: {
      data: Record<string, any>;
      description: string;
      expectedResult: boolean;
      name: string;
      secret: string;
      signature: null | string;
    }) => {
      it(`should ${fixture.name}`, () => {
        const result = signatureService.verify(fixture.data, fixture.signature, fixture.secret);
        expect(result).toBe(fixture.expectedResult);
      });

      it(`should have consistent verification for ${fixture.name}`, () => {
        const result1 = signatureService.verify(fixture.data, fixture.signature, fixture.secret);
        const result2 = signatureService.verify(fixture.data, fixture.signature, fixture.secret);
        expect(result1).toBe(result2);
      });
    },
  );
});

describe("Signature - Round-trip Sign and Verify", () => {
  signCases.forEach((fixture: { description: string; expectedSignature: string; input: Record<string, any>; name: string; secret: string }) => {
    it(`should successfully sign then verify ${fixture.name}`, () => {
      const signature = signatureService.sign(fixture.input, fixture.secret);
      const verified = signatureService.verify(fixture.input, signature, fixture.secret);
      expect(verified).toBe(true);
    });
  });
});
