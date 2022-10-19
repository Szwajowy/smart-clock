import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { slideInAnimation } from './animations';

import { DeviceInfoResponse } from '@shared/models/responses/device-info.response';
import { FirebaseService } from './core/services/firebase.service';
import { AlarmsService } from './modules/alarms/alarms.service';
import { NotificationsService } from './modules/home/notifications.service';
import { SettingsService } from './modules/settings/settings.service';
import { WeatherService } from './modules/weather/weather.service';
import { GetDeviceInformationsService } from './core/http/device/get-device-informations.service';

@Component({
  selector: 'app-root',
  animations: [slideInAnimation],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  constructor(
    private getDeviceInformationsService: GetDeviceInformationsService,
    private settingsService: SettingsService,
    private alarmService: AlarmsService,
    private firebaseService: FirebaseService,
    private notificationsService: NotificationsService,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.getDeviceInformationsService
      .getDeviceInfo()
      .pipe(first())
      .subscribe((response: { result: DeviceInfoResponse }) => {
        this.firebaseService.setSerial(response.result.serial);
        this.subscriptions.add(this.settingsService.loadSettings());
      });

    this.notificationsService.subscribeToAll();
    this.subscriptions.add(this.weatherService.getWeather().subscribe());

    setTimeout(() => {
      this.subscriptions.add(this.alarmService.fetchAlarmsFromDb().subscribe());
    }, 1000);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}
