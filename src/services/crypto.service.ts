import { ICryptoStrategy } from "#types/crypto.types";

export class CryptoService {
  constructor(private strategy: ICryptoStrategy) {}

  /**
   * Decrypts all top-level properties of an object
   * Intelligently detects which values are encrypted using the strategy
   * @param payload - The object to decrypt
   * @returns A new object with encrypted properties decrypted
   */
  decrypt(payload: Record<string, any>): Record<string, any> {
    const decrypted: Record<string, any> = {};

    for (const [key, value] of Object.entries(payload)) {
      if (typeof value === "string" && this.strategy.canDecrypt(value)) {
        try {
          const decodedValue = this.strategy.decrypt(value);
          decrypted[key] = parseDecodedValue(decodedValue);
        } catch {
          decrypted[key] = value;
        }
      } else {
        decrypted[key] = value;
      }
    }

    return decrypted;
  }

  /**
   * Encrypts all top-level properties of an object
   * @param payload - The object to encrypt
   * @returns A new object with all top-level properties encrypted
   */
  encrypt(payload: Record<string, any>): Record<string, string> {
    const encrypted: Record<string, string> = {};

    for (const [key, value] of Object.entries(payload)) {
      const stringValue = valueToString(value);
      encrypted[key] = this.strategy.encrypt(stringValue);
    }

    return encrypted;
  }
}

function parseDecodedValue(decoded: string): any {
  if (decoded === "null") {
    return null;
  }

  // Try to parse as JSON (objects, arrays)
  if ((decoded.startsWith("{") && decoded.endsWith("}")) || (decoded.startsWith("[") && decoded.endsWith("]"))) {
    try {
      return JSON.parse(decoded);
    } catch {
      // If JSON parsing fails, treat as string
    }
  }

  if (decoded === "true") {
    return true;
  }
  if (decoded === "false") {
    return false;
  }

  const numberValue = Number(decoded);
  if (!Number.isNaN(numberValue) && decoded.trim() !== "") {
    return numberValue;
  }

  return decoded;
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
