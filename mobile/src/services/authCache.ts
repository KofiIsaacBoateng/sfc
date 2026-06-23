import { FirebaseAuthTypes } from "@react-native-firebase/auth";

class AuthCacheManager {
  // Holds the live token receipt between screen redirects
  private activeConfirmation: FirebaseAuthTypes.ConfirmationResult | null =
    null;

  public setConfirmation(result: FirebaseAuthTypes.ConfirmationResult | null) {
    this.activeConfirmation = result;
  }

  public getConfirmation(): FirebaseAuthTypes.ConfirmationResult | null {
    return this.activeConfirmation;
  }

  public clear() {
    this.activeConfirmation = null;
  }
}

export const authCache = new AuthCacheManager();
