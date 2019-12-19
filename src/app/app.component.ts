import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as moment from 'moment';

import { slideInAnimation } from './animations';
import { WeatherService } from './weather.service';
import { NotificationsService } from './notifications.service';

@Component({
  selector: 'app-root',
  animations: [
    slideInAnimation
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private notificationsSubscription;
  private weatherSubscription;

  constructor(private weatherService:WeatherService, private notificationsService: NotificationsService) {}

  ngOnInit() {
    moment.locale('pl');

    this.weatherSubscription = this.weatherService.getWeather().subscribe();
    this.notificationsSubscription = this.notificationsService.getNotificationsSubject().subscribe();

    this.notificationsService.subscribeToAll();
  }

  ngOnDestroy () {
    this.weatherSubscription.unsubscribe();
    this.notificationsSubscription.unsubscribe();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
