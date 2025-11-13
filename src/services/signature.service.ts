import type { JSONPayload } from "#types/payload.types";
import type { ISignatureStrategy } from "#types/signature.types";
import type { ResultHelper } from "#utils/result.helper";

import { err, ok } from "#utils/result.helper";

export class SignatureService {
  constructor(private strategy: ISignatureStrategy) {}
  sign(payload: JSONPayload, secret: string): ResultHelper<string> {
    try {
      const signature = this.strategy.sign(payload, secret);
      return ok(signature);
    } catch (error) {
      return err((error as Error).message);
    }
  }

  verify(payload: JSONPayload, signature: null | string | undefined, secret: string): ResultHelper<boolean> {
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
