export interface User {
  uid: string;
  name: string;
  email: string;
}

export function convertUser(firebaseUser: any): User {
  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName,
    email: firebaseUser.email,
  };
}
