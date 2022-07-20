import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { delay, map, mergeMap, retryWhen, switchMap } from "rxjs/operators";

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

interface Token {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  tokenType: string;
  expiresIn: number;
  scope?: string;
}

enum RequestTokenError {
  PENDING = "authorization_pending",
  TOO_FAST_REQUEST = "slow_down",
  EXPIRED = "expired_token",
  DENIED = "access_denied",
  INVALID = "invalid_grants",
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token: Token;

  isAuthenticated(): boolean {
    // Check if we have a token and if its still valid
    return !!this.token?.accessToken;
  }

  async getUserInfo() {
    const url = "https://dev-pc9p8mvd.eu.auth0.com/userinfo";
    const options = {
      method: "GET",
      headers: {
        authorization: `Bearer ${this.token.accessToken}`,
        "content-type": "application/json",
      },
    };

    return await (await fetch(url, options)).json();
  }

  async requestDeviceCode(): Promise<DeviceCodeResponse> {
    const url = "https://dev-pc9p8mvd.eu.auth0.com/oauth/device/code";
    const params = new URLSearchParams();
    params.append("client_id", "6V2DLY1XNvbz87a6kaUbtQq0CYjSWFXs");
    params.append("audience", "http://localhost:3000/");
    params.append("scope", "offline_access openid profile");
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: params,
    };

    const response = await fetch(url, options);
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    return jsonResponse;
  }

  requestToken(deviceCode: string, interval: number): Observable<boolean> {
    if (!deviceCode) return;

    const url = "https://dev-pc9p8mvd.eu.auth0.com/oauth/token";
    const params = new URLSearchParams();
    params.append("grant_type", "urn:ietf:params:oauth:grant-type:device_code");
    params.append("device_code", deviceCode);
    params.append("client_id", "6V2DLY1XNvbz87a6kaUbtQq0CYjSWFXs");
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: params,
    };

    return fromFetch(url, options).pipe(
      switchMap((res) => res.json()),
      map((jsonResponse) => {
        if (jsonResponse?.error) {
          throw jsonResponse.error;
        }

        this.token = {
          accessToken: jsonResponse["access_token"],
          expiresIn: jsonResponse["expires_in"],
          scope: jsonResponse["scope"],
          tokenType: jsonResponse["token_type"],
        };

        return true;
      }),
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error) => {
            if (error === RequestTokenError.PENDING) {
              return of(error);
            }

            return throwError(error);
          }),
          delay(interval * 1000)
        )
      )
    );
  }
}
