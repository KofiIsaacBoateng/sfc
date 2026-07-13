import { parsePhoneNumberFromString } from "libphonenumber-js";
import { InvalidPhoneNumber } from "../../errors/index.js";

export class PhoneNumber {
  private constructor(private readonly _value: string) {}

  static create(input: string): PhoneNumber {
    const phoneNumber = parsePhoneNumberFromString(input, "GH");

    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new InvalidPhoneNumber();
    }

    return new PhoneNumber(phoneNumber.format("E.164"));
  }

  static restore(input: string): PhoneNumber {
    return new PhoneNumber(input);
  }

  get value(): string {
    return this._value;
  }

  equals(other: PhoneNumber) {
    return this._value === other._value;
  }
}
