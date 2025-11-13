export function getSignatureSecret(): string {
  const secret = process.env.SIGNATURE_SECRET;
  if (!secret) {
    throw new Error("SIGNATURE_SECRET not configured");
  }
  return secret;
}
