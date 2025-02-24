export enum EAuthProvider {
  GOOGLE = 'google',
}

export interface AuthPayload {
  provider: EAuthProvider;
  providerId: string;
  email?: string;
  name?: string;
  picture?: string;
}
