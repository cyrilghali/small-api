import type { JSONPayload } from "#types/payload.types";

export interface ISignatureStrategy {
  sign(payload: JSONPayload, secret: string): string;
  verify(payload: JSONPayload, signature: string, secret: string): boolean;
}
