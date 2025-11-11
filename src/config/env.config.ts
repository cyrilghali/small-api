/**
 * Environment configuration and validation
 * Ensures required secrets and configuration are present at startup
 */

const MIN_SECRET_LENGTH = 32;

export function getSignatureSecret(): string {
  const secret = process.env.SIGNATURE_SECRET;
  if (!secret) {
    throw new Error("SIGNATURE_SECRET not configured");
  }
  return secret;
}

export function validateEnvironment(): void {
  const signatureSecret = process.env.SIGNATURE_SECRET;

  if (!signatureSecret) {
    throw new Error("SIGNATURE_SECRET environment variable is required. " + "Please set it to a secure random string (minimum 32 characters).");
  }

  if (signatureSecret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `SIGNATURE_SECRET must be at least ${String(MIN_SECRET_LENGTH)} characters long. ` +
        `Current length: ${String(signatureSecret.length)} characters.`,
    );
  }
}
