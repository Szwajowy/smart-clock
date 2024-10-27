import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrightnessResponse } from '@shared/models/responses/brightness.response';
import { environment } from 'environments/environment';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetDeviceBacklightBrightnessService {
  constructor(private http: HttpClient) {}

  getDeviceBacklightBrightness(): Observable<BrightnessResponse> {
    return this.http
      .get<BrightnessResponse>(
        environment.helperApi.url + '/backlight_brightness',
      )
      .pipe(
        catchError(() => {
          // TODO: Display message to user
          return of({ brightness: 0 });
        }),
      );
  }
}
