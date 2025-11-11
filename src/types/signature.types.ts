/**
 * Signature strategy interface
 * Implementations handle signing and verification operations
 */
export interface ISignatureStrategy {
  /**
   * Creates a signature for a payload
   * The signature must be deterministic and order-independent
   * @param payload - The payload to sign
   * @returns The signature as a hex string
   */
  sign(payload: Record<string, any>): string;

  /**
   * Verifies a signature against a payload
   * @param payload - The payload to verify
   * @param signature - The signature to verify against
   * @returns True if the signature is valid
   */
  verify(payload: Record<string, any>, signature: string): boolean;
}
