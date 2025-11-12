import type { ISignatureStrategy } from "#types/signature.types";
import type { Result } from "#utils/result";

import { err, ok } from "#utils/result";

export class SignatureService {
  constructor(private strategy: ISignatureStrategy) {}
  sign(payload: Record<string, any>, secret: string): Result<string> {
    try {
      const signature = this.strategy.sign(payload, secret);
      return ok(signature);
    } catch (error) {
      return err((error as Error).message);
    }
  }

  verify(payload: Record<string, any>, signature: null | string | undefined, secret: string): Result<boolean> {
    if (!signature) {
      return err("Signature is required");
    }

    try {
      const isValid = this.strategy.verify(payload, signature, secret);
      return ok(isValid);
    } catch (error) {
      return err((error as Error).message);
    }
  }
}
