export interface ICryptoStrategy {
  canDecrypt(value: string): boolean;
  decrypt(value: string): string;
  encrypt(value: string): string;
}
