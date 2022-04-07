import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { catchError, Observable, of } from "rxjs";

import { WeatherResponse } from "@shared/models/responses/weather.response";

@Injectable({
  providedIn: "root",
})
export class GetWeatherService {
  constructor(private http: HttpClient) {}

  getWeather(cityName: string): Observable<WeatherResponse> {
    return this.http
      .get<WeatherResponse>(
        `${environment.openWeather.apiURL}/data/2.5/forecast?q=${cityName}&units=metric&lang=pl&appid=${environment.openWeather.apiKey}`
      )
      .pipe(
        catchError((error) => {
          // TODO: Display information to user
          return of(null);
        })
      );
  }
}
