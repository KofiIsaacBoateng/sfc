import { describe, expect, it } from "vitest";
import { PhoneNumber } from "@/shared/domain/value-objects/phone-number.vo.js";

describe("PhoneNumber Value Object", () => {
  it("should create a valid Ghana phone number.", () => {
    const phone = PhoneNumber.create("0505518102");

    expect(phone.value).toBe("+233505518102");
  });

  it("should accept E.164 format", () => {
    const phone = PhoneNumber.create("+233505518102");

    expect(phone.value).toBe("+233505518102");
  });

  it("should reject invalid phone numbers", () => {
    expect(() => {
      PhoneNumber.create("invalid-number");
    }).toThrow();
  });

  it("should compare two phone numbers by value", () => {
    const phone1 = PhoneNumber.create("+233505518102");
    const phone2 = PhoneNumber.create("0505518102");

    expect(phone1.equals(phone2)).toBe(true);
  });
});
