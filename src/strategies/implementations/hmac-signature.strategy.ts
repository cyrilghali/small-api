import type { JSONPayload, JSONValue } from "#types/payload.types";
import type { ISignatureStrategy } from "#types/signature.types";

import { createHmac, timingSafeEqual } from "crypto";

export class HmacSignatureStrategy implements ISignatureStrategy {
  sign(payload: JSONPayload, secret: string): string {
    const canonicalPayload = canonicalizeJson(payload);
    return createHmac("sha256", secret).update(canonicalPayload).digest("hex");
  }

  verify(payload: JSONPayload, signature: string, secret: string): boolean {
    const expectedSignature = this.sign(payload, secret);
    try {
      return timingSafeEqual(Buffer.from(expectedSignature, "hex"), Buffer.from(signature, "hex"));
    } catch (error) {
      console.error("Error verifying signature with timingSafeEqual:", { error });
      return false;
    }
  }
}

export function canonicalizeJson(value: JSONValue): string {
  return JSON.stringify(deepSortKeys(value));
}

export function deepSortKeys(value: JSONValue): JSONValue {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(deepSortKeys);
  }

  const sorted: JSONPayload = {};
  Object.keys(value as object)
    .sort()
    .forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment -- value is guaranteed to be an object; recursively processing arbitrary JSON properties
      sorted[key] = deepSortKeys(value[key]);
    });
  return sorted;
}
