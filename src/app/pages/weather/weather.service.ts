import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from 'app/shared/components/notification-bar/notifications.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
    providedIn: 'root',
  })
export class WeatherService implements OnDestroy{
    private weatherSubscription;
    private firebaseSubscription;

    private weather;
    private weatherSubject = new Subject<any>();

    constructor(private db: AngularFireDatabase, private http: HttpClient, private notificationsService: NotificationsService) {}

    ngOnDestroy() {
        this.weatherSubscription.unsubscribe();
        this.firebaseSubscription.unsubscribe();
    }

    fetchAlarmsFromAPI() {
        this.firebaseSubscription = this.db.object('weather').valueChanges().subscribe(res => {
            this.weather = res;
            this.weatherSubject.next(this.weather);
        });
    }

    pushWeatherToAPI() {
        this.db.object('weather').set(this.weather);
    }

    getWeather() {
        let actualTime = new Date();

        this.fetchAlarmsFromAPI();

        return new Observable<any>(subscriber => {
            if(!this.weather || (actualTime.getDate() != this.weather.updateAt.getDate()) || (actualTime.getTime() > this.weather.updateAt.getTime() + 1000 * 60 * 60 * 2)) {                
                console.log("Rozpoczęto pobieranie pogody z API.");

                this.weatherSubscription = this.http.get<any>('http://api.openweathermap.org/data/2.5/forecast?q=Katowice&units=metric&lang=pl&APPID=7d83068566f71e51d798a6cf184d000c')
                    .subscribe(forecastWeather => {
                        console.log("Zakończono pobieranie pogody z API.");

                        this.weather = [];

                        let list = [];
                        for(let i = 0; i < forecastWeather.list.length - 7; i += 8) {
                            list.push(forecastWeather.list[i]);
                        }
                        forecastWeather.list = list;

                        this.weather = forecastWeather;
                        this.weather.updateAt = new Date();

                        this.weatherSubject.next(this.weather);
                        
                        subscriber.next(this.weather);
                        subscriber.complete();

                        // Wyślij powiadomienie do serwisu powiadomień
                        this.notificationsService.getInputNotificationsSubject().next({
                            type: 'weather',
                            operation: 'post',
                            content: this.weather.list[0].weather[0].description + ' ' + Math.round(this.weather.list[0].main.temp) + ' °C',
                            icon: this.weather.list[0].weather[0].icon,
                        });

                        this.pushWeatherToAPI();
                    });

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