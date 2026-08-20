import { describe, expect, it } from "vitest";

import {
  Merchant,
  MerchantStatus,
} from "../../domain/entities/merchant.entity.js";

describe("Merchant", () => {
  it("should create an active merchant", () => {
    const merchant = Merchant.create({
      userId: "user-1",
      businessName: "SFC Store",
    });

    expect(merchant.userId).toBe("user-1");
    expect(merchant.businessName).toBe("SFC Store");

    expect(merchant.status).toBe(MerchantStatus.ACTIVE);

    expect(merchant.isActive()).toBe(true);
  });

  it("should suspend a merchant", () => {
    const merchant = Merchant.create({
      userId: "user-1",
      businessName: "SFC Store",
    });

    merchant.suspend();

    expect(merchant.status).toBe(MerchantStatus.SUSPENDED);

    expect(merchant.isActive()).toBe(false);
  });

  it("should reactivate a merchant", () => {
    const merchant = Merchant.create({
      userId: "user-1",
      businessName: "SFC Store",
    });

    merchant.suspend();
    merchant.activate();

    expect(merchant.isActive()).toBe(true);
  });

  it("should close a merchant", () => {
    const merchant = Merchant.create({
      userId: "user-1",
      businessName: "SFC Store",
    });

    merchant.close();

    expect(merchant.status).toBe(MerchantStatus.CLOSED);

    expect(merchant.isActive()).toBe(false);
  });
});
