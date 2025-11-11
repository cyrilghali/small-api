import { createHmac } from "crypto";
import { ISignatureStrategy } from "#types/signature.types";

export class HmacSignatureStrategy implements ISignatureStrategy {
  sign(payload: Record<string, any>, secret: string): string {
    const canonicalPayload = canonicalizeJson(payload);
    return createHmac("sha256", secret).update(canonicalPayload).digest("hex");
  }

  verify(payload: Record<string, any>, signature: string, secret: string): boolean {
    const expectedSignature = this.sign(payload, secret);
    return expectedSignature === signature;
  }
}

function canonicalizeJson(value: any): string {
  if (value === null) {
    return "null";
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      const items = value.map(canonicalizeJson);
      return `[${items.join(",")}]`;
    }

    const keys = Object.keys(value).sort();
    const items = keys.map((key) => `${JSON.stringify(key)}:${canonicalizeJson(value[key])}`);
    return `{${items.join(",")}}`;
  }

  return JSON.stringify(value);
}
