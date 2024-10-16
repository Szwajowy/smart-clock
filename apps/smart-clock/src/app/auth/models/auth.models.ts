export interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete: string;
  expires_in: number;
  interval: number;
}

export interface TokenResponse {
  grant_type: string;
  device_code: string;
  client_id: string;
}

export interface UserResponse {
  name?: string;
  nickname?: string;
  picture?: string;
  sub?: string;
  updated_at?: string;
}

export interface Token {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  tokenType: string;
  expiresIn: number;
  scope?: string;
}

export enum RequestTokenError {
  PENDING = 'authorization_pending',
  TOO_FAST_REQUEST = 'slow_down',
  EXPIRED = 'expired_token',
  DENIED = 'access_denied',
  INVALID = 'invalid_grants',
}
