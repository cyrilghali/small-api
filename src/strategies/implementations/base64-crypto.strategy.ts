import { ICryptoStrategy } from "#types/crypto.types";

export class Base64CryptoStrategy implements ICryptoStrategy {
  canDecrypt(value: string): boolean {
    try {
      return Buffer.from(value, "base64").toString("base64") === value;
    } catch {
      return false;
    }
  }

  decrypt(value: string): string {
    return Buffer.from(value, "base64").toString("utf-8");
  }

  encrypt(value: string): string {
    return Buffer.from(value, "utf-8").toString("base64");
  }
}
