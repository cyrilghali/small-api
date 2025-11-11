import { createHmac } from "crypto";
import { ISignatureStrategy } from "#types/signature.types";

export class HmacSignatureStrategy implements ISignatureStrategy {
  sign(payload: Record<string, any>, secret: string): string {
    const payloadString = JSON.stringify(payload);
    return createHmac("sha256", secret).update(payloadString).digest("hex");
  }

  verify(payload: Record<string, any>, signature: string, secret: string): boolean {
    const expectedSignature = this.sign(payload, secret);
    return expectedSignature === signature;
  }
}
