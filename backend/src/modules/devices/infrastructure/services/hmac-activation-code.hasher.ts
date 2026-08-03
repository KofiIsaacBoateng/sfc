import { createHmac } from "node:crypto";
import type { ActivationCodeHasher } from "../../applications/ports/activation-code-hasher.js";

export class HamacActivationCodeHasher implements ActivationCodeHasher {
  constructor(private readonly secret: string) {}

  async hash(activationCode: string): Promise<string> {
    return createHmac("sha256", this.secret)
      .update(activationCode.trim())
      .digest("hex");
  }
}
