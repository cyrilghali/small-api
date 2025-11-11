import { CryptoService } from "#services/crypto.service";
import { Base64CryptoStrategy } from "#strategies/implementations/base64-crypto.strategy";

const cryptoStrategy = new Base64CryptoStrategy();

export const cryptoService = new CryptoService(cryptoStrategy);
