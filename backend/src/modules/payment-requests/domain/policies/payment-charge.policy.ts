export interface PaymentChargePolicy {
  calculateCharge(amountMinor: bigint): bigint;
}

export class DefaultPaymentChargePolicy implements PaymentChargePolicy {
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
