import { SignatureService } from "#services/signature.service";
import { HmacSignatureStrategy } from "#strategies/implementations/hmac-signature.strategy";

const signatureStrategy = new HmacSignatureStrategy();
export const signatureService = new SignatureService(signatureStrategy);
