import type { ICryptoStrategy } from "#types/crypto.types";

export class CryptoService {
  constructor(private strategy: ICryptoStrategy) {}

  /**
   * Decrypts all top-level properties of an object
   * Intelligently detects which values are encrypted using the strategy
   * @param payload - The object to decrypt
   * @returns A new object with encrypted properties decrypted, preserving input shape
   */
  decrypt<T extends Record<string, any>>(payload: T): T {
    return Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [
        key,
        typeof value === "string" && this.strategy.canDecrypt(value) ? tryDecrypt(value, this.strategy.decrypt.bind(this.strategy)) : value,
      ]),
    ) as T;
  }

  /**
   * Encrypts all top-level properties of an object
   * @param payload - The object to encrypt
   * @returns A new object with all top-level properties encrypted
   */
  encrypt(payload: Record<string, any>): Record<string, string> {
    return Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, this.strategy.encrypt(valueToString(value))]));
  }
}

function parseDecodedValue(decoded: string): any {
  if (decoded === "null") return null;
  if (decoded === "true") return true;
  if (decoded === "false") return false;

  if (decoded.trim() !== "" && !Number.isNaN(Number(decoded))) {
    return Number(decoded);
  }

  try {
    return JSON.parse(decoded);
  } catch {
    return decoded;
  }
}

function tryDecrypt(value: string, decrypt: (v: string) => string): any {
  try {
    return parseDecodedValue(decrypt(value));
  } catch {
    return value;
  }
}

function valueToString(value: any): string {
  if (value === null) {
    return "null";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
