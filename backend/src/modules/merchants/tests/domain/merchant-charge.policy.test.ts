import { describe, expect, it } from "vitest";

import { DefaultMerchantChargePolicy } from "../../domain/policies/merchant-charge.policy.js";

describe("DefaultMerchantChargePolicy", () => {
  const policy = new DefaultMerchantChargePolicy();

  it("should calculate the configured percentage charge", () => {
    expect(policy.calculateCharge(10_000n)).toBe(40n);
  });

  it("should reject zero", () => {
    expect(() => policy.calculateCharge(0n)).toThrow(
      "Amount must be greater than zero.",
    );
  });

  it("should reject negative amounts", () => {
    expect(() => policy.calculateCharge(-1n)).toThrow(
      "Amount must be greater than zero.",
    );
  });

  it("should respect the maximum charge", () => {
    expect(policy.calculateCharge(2_000_000n)).toBe(500n);
  });
});
