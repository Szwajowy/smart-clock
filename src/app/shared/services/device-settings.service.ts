import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const DEVICE_HELPER_API_URL = "http://localhost:8080";

enum DEVICE_HELPER_API_ENDPOINTS {
  screenBrightness = `/backlight_brightness`,
}

@Injectable({
  providedIn: "root",
})
export class DeviceSettingsService {
  constructor(private http: HttpClient) {}

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

  private calcBrightness(value: number): number {
    return Math.round(200 / 11 + (20 * value) / 11);
  }
}
