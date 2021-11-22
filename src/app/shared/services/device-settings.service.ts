import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DeviceInfo } from "@shared/models/device-info.model";
import { Observable } from "rxjs";

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
    return this.http.get<{ brightness: number }>(
      DEVICE_HELPER_API_URL + DEVICE_HELPER_API_ENDPOINTS.screenBrightness
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

    return this.http.post<{ brightness: number }>(
      DEVICE_HELPER_API_URL + DEVICE_HELPER_API_ENDPOINTS.screenBrightness,
      requestBody,
      requestOptions
    );
  }

  getDeviceInfo(): Observable<{ result: DeviceInfo }> {
    return this.http.get<{ result: DeviceInfo }>(
      DEVICE_HELPER_API_URL + DEVICE_HELPER_API_ENDPOINTS.deviceInfo
    );
  }

  private calcBrightness(value: number): number {
    return Math.round((188 * value) / 99 + 1000 / 99);
  }
}
