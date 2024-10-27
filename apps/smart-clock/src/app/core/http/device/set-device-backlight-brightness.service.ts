import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrightnessResponse } from '@shared/models/responses/brightness.response';
import { environment } from 'environments/environment';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SetDeviceBacklightBrightnessService {
  constructor(private http: HttpClient) {}

  setDeviceBacklightBrightness(
    brightness: number,
  ): Observable<BrightnessResponse> {
    const requestBody = {
      brightness: this.calcBrightness(brightness),
    };

    const requestOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http
      .post<BrightnessResponse>(
        environment.helperApi.url + '/backlight_brightness',
        requestBody,
        requestOptions,
      )
      .pipe(
        catchError(() => {
          // TODO: Display message to user
          return of({ brightness: 0 });
        }),
      );
  }

  private calcBrightness(value: number): number {
    return Math.round((188 * value) / 99 + 1000 / 99);
  }
}
