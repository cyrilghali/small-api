/**
 * Cryptographic strategy interface
 * Implementations handle encryption/decryption operations
 */
export interface ICryptoStrategy {
  /**
   * Checks if a value can be decrypted by this strategy
   * @param value - The value to check
   * @returns True if the value is encrypted and can be decrypted
   */
  canDecrypt(value: string): boolean;

  /**
   * Decrypts a value
   * @param value - The encrypted value
   * @returns The decrypted value as a string
   */
  decrypt(value: string): string;

  /**
   * Encrypts a value
   * @param value - The value to encrypt
   * @returns The encrypted value as a string
   */
  encrypt(value: string): string;
}
