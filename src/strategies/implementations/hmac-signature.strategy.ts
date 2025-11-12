import type { ISignatureStrategy } from "#types/signature.types";

import { createHmac, timingSafeEqual } from "crypto";

export class HmacSignatureStrategy implements ISignatureStrategy {
  sign(payload: Record<string, any>, secret: string): string {
    const canonicalPayload = canonicalizeJson(payload);
    return createHmac("sha256", secret).update(canonicalPayload).digest("hex");
  }

  verify(payload: Record<string, any>, signature: string, secret: string): boolean {
    const expectedSignature = this.sign(payload, secret);
    try {
      return timingSafeEqual(Buffer.from(expectedSignature, "hex"), Buffer.from(signature, "hex"));
    } catch {
      return false;
    }
  }
}

export function canonicalizeJson(value: any): string {
  return JSON.stringify(deepSortKeys(value));
}

export function deepSortKeys(value: any): any {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(deepSortKeys);
  }

  const sorted: Record<string, any> = {};
  Object.keys(value)
    .sort()
    .forEach((key) => {
      sorted[key] = deepSortKeys(value[key]);
    });
  return sorted;
}
