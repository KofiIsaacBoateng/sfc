import { describe, expect, it } from "vitest";

import {
  PaymentRequest,
  PaymentRequestStatus,
} from "../../domain/entities/payment-request.entity.js";
import { Currency } from "@/shared/domain/value-objects/currency.vo.js";

describe("PaymentRequest", () => {
  const futureDate = () => new Date(Date.now() + 60_000);

  function createRequest() {
    return PaymentRequest.create({
      requesterId: "merchant-1",
      amount: 10_000n,
      feeAmount: 40n,
      currency: Currency.GHS,
      reference: "REQ-001",
      expiresAt: futureDate(),
    });
  }

  it("should create a pending payment request", () => {
    const request = createRequest();

    expect(request.status).toBe(PaymentRequestStatus.PENDING);

    expect(request.amount).toBe(10_000n);
    expect(request.feeAmount).toBe(40n);
    expect(request.totalAmount).toBe(10_040n);
    expect(request.transactionId).toBeNull();
  });

  it("should reject a non-positive amount", () => {
    expect(() =>
      PaymentRequest.create({
        requesterId: "merchant-1",
        amount: 0n,
        feeAmount: 40n,
        currency: Currency.GHS,
        reference: "REQ-001",
        expiresAt: futureDate(),
      }),
    ).toThrow("Payment request amount must be greater than zero.");
  });

  it("should reject a negative fee", () => {
    expect(() =>
      PaymentRequest.create({
        requesterId: "merchant-1",
        amount: 10_000n,
        feeAmount: -1n,
        currency: Currency.GHS,
        reference: "REQ-001",
        expiresAt: futureDate(),
      }),
    ).toThrow("Fee amount cannot be negative.");
  });

  it("should reject an already expired request", () => {
    expect(() =>
      PaymentRequest.create({
        requesterId: "merchant-1",
        amount: 10_000n,
        feeAmount: 40n,
        currency: Currency.GHS,
        reference: "REQ-001",
        expiresAt: new Date(Date.now() - 1_000),
      }),
    ).toThrow("Payment request must expire in the future.");
  });

  it("should transition from pending to processing", () => {
    const request = createRequest();

    request.startProcessing();

    expect(request.status).toBe(PaymentRequestStatus.PROCESSING);
  });

  it("should not process a non-pending request", () => {
    const request = PaymentRequest.restore({
      id: "request-1",
      requesterId: "merchant-1",
      amount: 10_000n,
      feeAmount: 40n,
      totalAmount: 10_040n,
      currency: Currency.GHS,
      reference: "REQ-001",
      status: PaymentRequestStatus.COMPLETED,
      expiresAt: futureDate(),
      transactionId: "transaction-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(() => request.startProcessing()).toThrow(
      "Payment request is not pending.",
    );
  });

  it("should complete a processing request", () => {
    const request = createRequest();

    request.startProcessing();
    request.complete("transaction-1");

    expect(request.status).toBe(PaymentRequestStatus.COMPLETED);

    expect(request.transactionId).toBe("transaction-1");
  });

  it("should reject completion unless processing", () => {
    const request = createRequest();

    expect(() => request.complete("transaction-1")).toThrow(
      "Payment request is no longer processing.",
    );
  });

  it("should cancel a pending request", () => {
    const request = createRequest();

    request.cancel();

    expect(request.status).toBe(PaymentRequestStatus.CANCELLED);
  });

  it("should reject cancelling a non-pending request", () => {
    const request = PaymentRequest.restore({
      id: "request-1",
      requesterId: "merchant-1",
      amount: 10_000n,
      feeAmount: 40n,
      totalAmount: 10_040n,
      currency: Currency.GHS,
      reference: "REQ-001",
      status: PaymentRequestStatus.COMPLETED,
      expiresAt: futureDate(),
      transactionId: "transaction-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(() => request.cancel()).toThrow(
      "Only pending payment requests can be cancelled.",
    );
  });

  it("should expire a pending request", () => {
    const request = createRequest();

    request.expire();

    expect(request.status).toBe(PaymentRequestStatus.EXPIRED);
  });

  it("should identify an expired request", () => {
    const request = PaymentRequest.restore({
      id: "request-1",
      requesterId: "merchant-1",
      amount: 10_000n,
      feeAmount: 40n,
      totalAmount: 10_040n,
      currency: Currency.GHS,
      reference: "REQ-001",
      status: PaymentRequestStatus.PENDING,
      expiresAt: new Date(Date.now() - 1_000),
      transactionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(request.isExpired()).toBe(true);
  });
});
