import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
  })
export class WeatherService implements OnDestroy{
    private ApiCallSubscription;

    private weatherSubject = new Subject<any>();
    private weather;
    private lastUpdateAt;

    constructor(private http: HttpClient) {}

    ngOnDestroy() {
        this.ApiCallSubscription.unsubscribe();
    }

    getWeather() {
        let actualTime = new Date();

        return new Observable<any>(subscriber => {
            if(!this.weather || (actualTime.getDate() != this.lastUpdateAt.getDate()) || (actualTime.getTime() > this.lastUpdateAt.getTime() + 1000 * 60 * 60 * 2)) {                
                this.lastUpdateAt = new Date();
                console.log("Rozpoczęto pobieranie pogody z API.");

                this.ApiCallSubscription = this.http
                .get<any>('http://api.openweathermap.org/data/2.5/forecast?q=Katowice&units=metric&lang=pl&cnt=2&APPID=7d83068566f71e51d798a6cf184d000c')
                .subscribe(
                    res => {
                        console.log(res);
                        console.log("Zakończono pobieranie pogody z API.");
                        this.weather = res;
                        subscriber.next(res);
                        subscriber.complete();

                        this.weatherSubject.next({
                            weather: res.list[0].weather[0].description,
                            icon: res.list[0].weather[0].icon,
                            temp: res.list[0].main.temp 
                        });
                    }
                );
            } else {
                console.log("Zwracam pogodę przechowywaną lokalnie!");
                subscriber.next(this.weather);
                subscriber.complete();
            }
            
        });
    }

    getWeatherSubject() {
        return this.weatherSubject;
    }
}