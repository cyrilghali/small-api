import { ISignatureStrategy } from "#types/signature.types";

export class SignatureService {
  constructor(private strategy: ISignatureStrategy) {}

  sign(payload: Record<string, any>, secret: string): string {
    return this.strategy.sign(payload, secret);
  }

  verify(payload: Record<string, any>, signature: null | string | undefined, secret: string): boolean {
    if (!signature) {
      return false;
    }

    return this.strategy.verify(payload, signature, secret);
  }
}
