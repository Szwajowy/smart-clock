import { Injectable } from '@angular/core';

import {
  interval,
  BehaviorSubject,
  of,
  Observable,
  Subject,
  merge,
} from 'rxjs';
import { switchMap, map, shareReplay, catchError } from 'rxjs/operators';

import { Weather } from '@shared/models/weather.model';
import { delayedRetry } from '@shared/functions/delayedRetry';
import { FirebaseService } from 'app/core/services/firebase.service';
import { NotificationsService } from '../home/notifications.service';
import { GetWeatherService } from 'app/core/http/weather/get-weather.service';
import { WeatherResponse } from '@shared/models/responses/weather.response';
import { Time } from '@shared/models/time.model';
import { isTimeBefore } from '@shared/functions/time-utils';

@Injectable()
export class WeatherService {
  private cityName = 'Katowice';

  private refresh$ = new BehaviorSubject(null);
  private refreshInterval$ = interval(1000 * 60 * 5);

  private updateTime = 1000 * 60 * 60 * 3;
  private weather$ = merge(this.refresh$, this.refreshInterval$).pipe(
    switchMap(() => {
      this.getLocalWeather();
      const localWeather = this.localWeather
        ? new Weather(this.localWeather)
        : null;

      const localWeatherUpdateDateTime = new Date(localWeather.updatedAt);
      const localWeatherUpdateTime = new Time(
        localWeatherUpdateDateTime.getHours(),
        localWeatherUpdateDateTime.getMinutes(),
      );
      const plannedRefreshDateTime = new Date(localWeatherUpdateDateTime);
      plannedRefreshDateTime.setHours(
        plannedRefreshDateTime.getHours() + this.updateTime,
      );
      const plannedRefreshTime = new Time(
        plannedRefreshDateTime.getHours(),
        plannedRefreshDateTime.getMinutes(),
      );

      if (
        localWeather &&
        !isTimeBefore(localWeatherUpdateTime, plannedRefreshTime) &&
        localWeather.city.name.toLowerCase() === this.cityName.toLowerCase()
      ) {
        this.sendNotification({
          icon: localWeather.list[0].weather[0].icon,
          weather: localWeather.list[0].weather[0].description,
          temp: localWeather.list[0].main.temp,
        });
        return of(localWeather);
      } else {
        return this.getFirebaseWeather().pipe(
          switchMap((weather: Weather) => {
            const firebaseWeather = weather ? new Weather(weather) : null;
            const firebaseWeatherUpdateDateTime = new Date(
              firebaseWeather.updatedAt,
            );
            const firebaseWeatherUpdateTime = new Time(
              firebaseWeatherUpdateDateTime.getHours(),
              firebaseWeatherUpdateDateTime.getMinutes(),
            );
            const plannedRefreshDateTime = new Date(
              firebaseWeatherUpdateDateTime,
            );
            plannedRefreshDateTime.setHours(
              plannedRefreshDateTime.getHours() + this.updateTime,
            );
            const plannedRefreshTime = new Time(
              plannedRefreshDateTime.getHours(),
              plannedRefreshDateTime.getMinutes(),
            );
            if (
              firebaseWeather &&
              !isTimeBefore(firebaseWeatherUpdateTime, plannedRefreshTime) &&
              firebaseWeather.city.name.toLowerCase() ===
                this.cityName.toLowerCase()
            ) {
              this.updateLocalWeather(firebaseWeather);
              this.sendNotification({
                icon: localWeather.list[0].weather[0].icon,
                weather: localWeather.list[0].weather[0].description,
                temp: localWeather.list[0].main.temp,
              });
              return of(firebaseWeather);
            } else {
              return this.getWeatherService.getWeather(this.cityName).pipe(
                map((openWeather: WeatherResponse) => {
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
                }),
              );
            }
          }),
          delayedRetry(1000, 3),
          catchError((error) => {
            console.log(error);
            return of(null);
          }),
        );
      }
    }),
    shareReplay(1),
  );

  private localWeather: Weather;

  private notificationSubject = new Subject();

  constructor(
    private firebaseService: FirebaseService,
    private notificationsService: NotificationsService,
    private getWeatherService: GetWeatherService,
  ) {}

  private getLocalWeather(): void {
    const localWeatherString = localStorage.getItem('weather');
    if (localWeatherString) this.localWeather = JSON.parse(localWeatherString);
  }

  private updateLocalWeather(weather): void {
    this.localWeather = weather;
    localStorage.setItem('weather', JSON.stringify(this.localWeather));
  }

  private getFirebaseWeather(): Observable<unknown> {
    return this.firebaseService.getDeviceData('weather') as Observable<unknown>;
  }

  private updateFirebaseWeather(weather: WeatherResponse) {
    return this.firebaseService.setDeviceData('weather', weather);
  }

  private sendNotification(notification: {
    weather: string;
    temp: number;
    icon: string;
  }) {
    this.notificationsService.getInputNotificationsSubject().next({
      type: 'weather',
      operation: 'post',
      content: `${
        notification.weather[0].toUpperCase() + notification.weather.slice(1)
      } ${Math.round(notification.temp)}°C`,
      icon: notification.icon,
    });
  }

  getWeather(): Observable<Weather | WeatherResponse> {
    return this.weather$;
  }

  getNotification(): Subject<unknown> {
    return this.notificationSubject;
  }

  setCity(city: string): void {
    this.cityName = city;
    this.refreshWeather();
  }

  setRefreshInterval(interval: number): void {
    this.updateTime = 1000 * 60 * 60 * interval;
    this.refreshWeather();
  }

  refreshWeather(): void {
    this.refresh$.next(null);
  }
}
