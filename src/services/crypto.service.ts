import type { ICryptoStrategy } from "#types/crypto.types";
import type { JSONPayload, JSONValue } from "#types/payload.types";

export class CryptoService {
  constructor(private strategy: ICryptoStrategy) {}

  /**
   * Decrypts all top-level properties of an object
   * Intelligently detects which values are encrypted using the strategy
   * @param payload - The object to decrypt
   * @returns A new object with encrypted properties decrypted
   */
  decrypt(payload: JSONPayload): JSONPayload {
    return Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [
        key,
        typeof value === "string" && this.strategy.canDecrypt(value) ? tryDecrypt(value, this.strategy.decrypt.bind(this.strategy)) : value,
      ]),
    );
  }

  /**
   * Encrypts all top-level properties of an object
   * @param payload - The object to encrypt
   * @returns A new object with all top-level properties encrypted
   */
  encrypt(payload: JSONPayload): Record<string, string> {
    return Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, this.strategy.encrypt(valueToString(value))]));
  }
}

function parseDecodedValue(decoded: string): JSONValue {
  if (decoded === "null") return null;
  if (decoded === "true") return true;
  if (decoded === "false") return false;

  if (decoded.trim() !== "" && !Number.isNaN(Number(decoded))) {
    return Number(decoded);
  }

  try {
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to parse decoded value:", { decoded, error });
    return decoded;
  }
}

function tryDecrypt(value: string, decrypt: (v: string) => string): JSONValue {
  try {
    return parseDecodedValue(decrypt(value));
  } catch (error) {
    console.error("Failed to decrypt value:", { error });
    return value;
  }
}

function valueToString(value: JSONValue): string {
  if (value === null) {
    return "null";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
