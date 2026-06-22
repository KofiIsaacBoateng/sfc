import BadRequestError from "../errors/bad-request.js";

export function normalizeGhanaianPhoneNumber(rawNumber: string): string {
  // Strip away all spaces, hyphens, brackets, and leading plus signs
  let cleaned = rawNumber.replace(/[\s\-\(\)\+]/g, "");

  // Case 1: User typed international format without plus (e.g., 233241234567)
  if (cleaned.startsWith("233") && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  // Case 2: User typed standard local format (e.g., 0241234567 or 0541234567)
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return `+233${cleaned.substring(1)}`;
  }

  // Case 3: User typed just the 9-digit structural block (e.g., 241234567)
  if (cleaned.length === 9) {
    return `+233${cleaned}`;
  }

  // Fallback: If it doesn't match standard Ghanaian telecom grids, reject it
  throw new BadRequestError(
    "Invalid phone number format. Please provide a valid Ghanaian phone number.",
  );
}
