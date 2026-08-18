export interface MerchantChargePolicy {
  calculateCharge(amountMinor: bigint): bigint;
}

export class DefaultMerchantChargePolicy implements MerchantChargePolicy {
  private readonly rateNumerator = 4n;
  private readonly rateDenominator = 1000n;

  private readonly minimumCharge = 0n;
  private readonly maximumCharge = 500n;

  calculateCharge(amountMinor: bigint): bigint {
    if (amountMinor <= 0n) {
      throw new Error("Amount must be greater than zero.");
    }

    let charge = (amountMinor * this.rateNumerator) / this.rateDenominator;

    if (charge < this.minimumCharge) {
      charge = this.minimumCharge;
    }

    if (charge > this.maximumCharge) {
      charge = this.maximumCharge;
    }

    return charge;
  }
}
