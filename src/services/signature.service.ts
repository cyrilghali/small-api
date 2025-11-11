import { ISignatureStrategy } from "#types/signature.types";

export class SignatureService {
  constructor(private strategy: ISignatureStrategy) {}

  sign(payload: Record<string, any>, secret: string): string {
    return this.strategy.sign(payload, secret);
  }

  verify(payload: Record<string, any>, signature: string | null | undefined, secret: string): boolean {
    if (!signature) {
      return false;
    }

    // Extract payload without signature field
    const { signature: _, ...payloadWithoutSignature } = payload;

    return this.strategy.verify(payloadWithoutSignature, signature, secret);
  }
}
