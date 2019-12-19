import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { WeatherService } from './weather.service';
import { ClockService } from './clock.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService implements OnInit, OnDestroy {
  private clockSubscription;
  private weatherSubscription;

  private timer = {
    timeSubscription: null
  }

  private stopwatch = {
    timeSubscription: null
  }

  private notificationsSubject = new Subject<any>();

  public notifications = [];

  constructor(private clockService: ClockService, private weatherService:WeatherService) { }

  ngOnInit() {
    this.timer.timeSubscription = this.clockService.getTimeSubject('timer');
    this.stopwatch.timeSubscription = this.clockService.getTimeSubject('stopwatch');
  }

  ngOnDestroy() {
    this.clockSubscription.unsubscribe();
    this.weatherSubscription.unsubscribe();
  }

  subscribeToClock() {
    this.clockSubscription = this.clockService.getSubject().subscribe(res => {

      let notificationExist = false;

      this.notifications.forEach((notification, index) => {
        if(notification.type == res.type) {
          if(res.event === 'paused' || res.event === 'stoped') {
            this.notifications.splice(index);
          } else {
            this.notifications[index] = { type: res.type, message: 'Jest włączony!' };
          }
          
          notificationExist = true;
        }
      });

      if(!notificationExist)
        this.notifications.push({ type: res.type, message: 'Jest włączony!' });

      this.getNotificationsSubject().next(this.notifications);
    });
  }

  subscribeToWeather() {
    this.weatherSubscription = this.weatherService.getWeatherSubject().subscribe(res => {

      let notificationExist = false;

      this.notifications.forEach((notification, index) => {
        if(notification.type == 'weather') {
          this.notifications[index] = { type: 'weather', icon: res.icon, message: res.weather +' '+ Math.round(res.temp)+' °C' };
          notificationExist = true;
        }
      });

      if(!notificationExist)
        this.notifications.push({ type: 'weather', icon: res.icon, message: res.weather +' '+ Math.round(res.temp)+' °C' });

      this.getNotificationsSubject().next(this.notifications);
    });
  }

  subscribeToAll() {
    this.subscribeToClock();
    this.subscribeToWeather();
  }

  getNotificationsSubject() {
    return this.notificationsSubject;
  }

  getNotifications() {
    return this.notifications;
  }
}
