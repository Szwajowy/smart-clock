import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  DEFAULT_DEVICE_INFO,
  DeviceInfo,
} from "@shared/models/device-info.model";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

const DEVICE_HELPER_API_URL = "http://localhost:8080";

enum DEVICE_HELPER_API_ENDPOINTS {
  screenBrightness = "/backlight_brightness",
  deviceInfo = "/device_info",
}

@Injectable({
  providedIn: "root",
})
export class DeviceSettingsService {
  constructor(private http: HttpClient) {}

  getDeviceBacklightBrightness(): Observable<{ brightness: number }> {
    return this.http
      .get<{ brightness: number }>(
        DEVICE_HELPER_API_URL + DEVICE_HELPER_API_ENDPOINTS.screenBrightness
      )
      .pipe(
        catchError((error) => {
          console.log("Error occured while trying to get backlight value");
          return of({ brightness: 0 });
        })
      );
  }

  setDeviceBacklightBrightness(
    brightness: number
  ): Observable<{ brightness: number }> {
    const requestBody = {
      brightness: this.calcBrightness(brightness),
    };

    const requestOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http
      .post<{ brightness: number }>(
        DEVICE_HELPER_API_URL + DEVICE_HELPER_API_ENDPOINTS.screenBrightness,
        requestBody,
        requestOptions
      )
      .pipe(
        catchError((error) => {
          console.log("Error occured while trying to set backlight value");
          return of({ brightness: 0 });
        })
      );
  }

  getDeviceInfo(): Observable<{ result: DeviceInfo }> {
    return this.http
      .get<{ result: DeviceInfo }>(
        DEVICE_HELPER_API_URL + DEVICE_HELPER_API_ENDPOINTS.deviceInfo
      )
      .pipe(
        catchError((error) => {
          console.log("Error occured while trying to get device data");

          return of({ result: DEFAULT_DEVICE_INFO });
        })
      );
  }

  private calcBrightness(value: number): number {
    return Math.round((188 * value) / 99 + 1000 / 99);
  }
}
