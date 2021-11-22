import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { catchError, first } from "rxjs/operators";
import * as moment from "moment";

import { slideInAnimation } from "./animations";

import { AlarmsService } from "./pages/alarms/alarms.service";
import { FirebaseService } from "@shared/services/firebase.service";
import { NotificationsService } from "app/pages/home/notification-bar/notifications.service";
import { SettingsService } from "./pages/settings/settings.service";
import { WeatherService } from "app/pages/weather/weather.service";
import { of, Subscription } from "rxjs";
import { DeviceSettingsService } from "@shared/services/device-settings.service";
import {
  DEFAULT_DEVICE_INFO,
  DeviceInfo,
} from "@shared/models/device-info.model";

@Component({
  selector: "app-root",
  animations: [slideInAnimation],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  constructor(
    private deviceSettings: DeviceSettingsService,
    private settingsService: SettingsService,
    private alarmService: AlarmsService,
    private firebaseService: FirebaseService,
    private notificationsService: NotificationsService,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    moment.locale("pl");
    this.deviceSettings
      .getDeviceInfo()
      .pipe(
        first(),
        catchError(() => {
          return of(DEFAULT_DEVICE_INFO);
        })
      )
      .subscribe((response: { result: DeviceInfo }) => {
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
      outlet.activatedRouteData["animation"]
    );
  }
}
