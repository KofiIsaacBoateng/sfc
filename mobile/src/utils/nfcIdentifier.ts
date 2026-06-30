import { TagEvent } from "react-native-nfc-manager";

export type SFCChipType =
  | "NTAG_215_PROTOTYPE"
  | "NTAG_424_DNA_PRODUCTION"
  | "UNKNOWN_TAG";

export function identifyNfcChipArchitecture(tag: TagEvent): SFCChipType {
  // 1. Android Specific Hardware Identification via system property lists
  if (tag.maxSize) {
    // NTAG 215 caps transceive transfers lower than the security-heavy 424 DNA
    if (tag.maxSize <= 253) {
      return "NTAG_215_PROTOTYPE";
    }
  }

  // 2. Structural Parsing of NDEF Record strings (Cross-Platform)
  // Our NTAG 424 DNA cards will always embed a dynamic query parameter string (?picc_data=...)
  if (tag.ndefMessage && tag.ndefMessage.length > 0) {
    const firstRecord = tag.ndefMessage[0];

    // Parse raw payload bytes out into a standard human-readable string
    const payloadString = String.fromCharCode(...(firstRecord.payload || []));

    if (payloadString.includes("picc_data") || payloadString.includes("enc=")) {
      return "NTAG_424_DNA_PRODUCTION";
    }
  }

  // 3. Fallback: If it's a standard blank Type 2 Tag without our SUN URL layout, treat as 215
  if (
    tag.techTypes?.includes("android.nfc.tech.NfcA") ||
    tag.techTypes?.includes("android.nfc.tech.Ndef")
  ) {
    return "NTAG_215_PROTOTYPE";
  }

  return "UNKNOWN_TAG";
}
