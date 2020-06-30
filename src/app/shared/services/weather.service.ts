import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  interval,
  BehaviorSubject,
  of,
  Observable,
  Subject,
  merge,
} from "rxjs";
import { switchMap, map, shareReplay, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";

import { FirebaseService } from "./firebase.service";

import { Weather } from "@shared/models/weather.model";
import { NotificationsService } from "@shared/components/notification-bar/notifications.service";
import { delayedRetry } from "@shared/functions/delayedRetry";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  private cityName: string = "Katowice";

  private refresh$ = new BehaviorSubject(null);
  private refreshInterval$ = interval(1000 * 60 * 5);

  private updateTime = 1000 * 60 * 60 * 3;

  private weather$ = merge(this.refresh$, this.refreshInterval$).pipe(
    switchMap(() => {
      console.log("Refreshing weather...");
      this.getLocalWeather();
      let localWeather = this.localWeather
        ? new Weather(this.localWeather)
        : null;
      if (
        localWeather &&
        localWeather.isUpdated &&
        localWeather.isUpdated(this.updateTime)
      ) {
        console.log("Locally stored weather is up-to-date.");
        this.sendNotification({
          icon: localWeather.list[0].weather[0].icon,
          weather: localWeather.list[0].weather[0].description,
          temp: localWeather.list[0].main.temp,
        });
        return of(localWeather);
      } else {
        return this.getFirebaseWeather().pipe(
          switchMap((weather: Weather) => {
            let firebaseWeather = weather ? new Weather(weather) : null;
            if (
              firebaseWeather &&
              firebaseWeather.isUpdated &&
              firebaseWeather.isUpdated(this.updateTime)
            ) {
              console.log("Weather stored in remote database is up-to-date.");
              this.updateLocalWeather(firebaseWeather);
              this.sendNotification({
                icon: localWeather.list[0].weather[0].icon,
                weather: localWeather.list[0].weather[0].description,
                temp: localWeather.list[0].main.temp,
              });
              return of(firebaseWeather);
            } else {
              return this.getOpenWeather().pipe(
                map((weather: Weather) => {
                  let openWeather = new Weather(weather);
                  console.log(
                    "Weather needs updating. Downloading weather from OpenWeatherAPI."
                  );
                  openWeather.updatedAt = new Date().getTime();

                  this.updateLocalWeather(openWeather);
                  this.updateFirebaseWeather(openWeather);
                  this.sendNotification({
                    icon: localWeather.list[0].weather[0].icon,
                    weather: localWeather.list[0].weather[0].description,
                    temp: localWeather.list[0].main.temp,
                  });
                  return openWeather;
                }),
                delayedRetry(1000, 3),
                catchError((error) => {
                  console.log(error);
                  return of(null);
                })
              );
            }
          }),
          delayedRetry(1000, 3),
          catchError((error) => {
            console.log(error);
            return of(null);
          })
        );
      }
    }),
    shareReplay(1)
  );

  private localWeather: Weather;
  private openWeather$ = this.http.get<Weather>(
    `${environment.openWeather.apiURL}/data/2.5/forecast?q=${this.cityName}&units=metric&lang=pl&appid=${environment.openWeather.apiKey}`
  );

  private notificationSubject = new Subject();

  constructor(
    private http: HttpClient,
    private firebaseService: FirebaseService,
    private notificationsService: NotificationsService
  ) {}

  private getLocalWeather(): void {
    let localWeatherString = localStorage.getItem("weather");
    if (localWeatherString) this.localWeather = JSON.parse(localWeatherString);
  }

  private updateLocalWeather(weather): void {
    this.localWeather = weather;
    localStorage.setItem("weather", JSON.stringify(this.localWeather));
  }

  private getOpenWeather(): Observable<Weather> {
    return this.openWeather$.pipe(
      map((weather: Weather) => {
        let result = JSON.parse(JSON.stringify(weather));
        result.updateTime = new Date().getTime();

        return result;
      })
    );
  }

  private getFirebaseWeather(): Observable<Weather> {
    return this.firebaseService.getDeviceData("weather") as Observable<Weather>;
  }

  private updateFirebaseWeather(weather: Weather) {
    return this.firebaseService.setDeviceData("weather", weather);
  }

  private sendNotification(notification: {
    weather: string;
    temp: number;
    icon: string;
  }) {
    this.notificationsService.getInputNotificationsSubject().next({
      type: "weather",
      operation: "post",
      content: `${
        notification.weather[0].toUpperCase() + notification.weather.slice(1)
      } ${Math.round(notification.temp)}°C`,
      icon: notification.icon,
    });
  }

  getWeather(): Observable<Weather> {
    return this.weather$;
  }

  getNotification(): Subject<any> {
    return this.notificationSubject;
  }

  setCity(city: string): void {
    this.cityName = city;
  }

  setRefreshInterval(interval: number): void {
    this.updateTime = 1000 * 60 * 60 * interval;
  }

  refreshWeather(): void {
    this.refresh$.next(null);
  }
}
