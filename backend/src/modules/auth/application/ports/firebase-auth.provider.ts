export interface FirebaseIdentity {
  firebaseIdUid: string;
  phoneNumber: string;
}

export interface FirebaseAuthProvider {
  verifyIdToken(tokenId: string): Promise<FirebaseIdentity>;
}
