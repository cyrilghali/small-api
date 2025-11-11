export interface ISignatureStrategy {
  sign(payload: Record<string, any>, secret: string): string;
  verify(payload: Record<string, any>, signature: string, secret: string): boolean;
}
