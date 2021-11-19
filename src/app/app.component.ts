import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterOutlet, ActivatedRoute } from "@angular/router";
import { first } from "rxjs/operators";
import * as moment from "moment";

import { slideInAnimation } from "./animations";

import { AlarmsService } from "./pages/alarms/alarms.service";
import { FirebaseService } from "@shared/services/firebase.service";
import { NotificationsService } from "app/pages/home/notification-bar/notifications.service";
import { SettingsService } from "./pages/settings/settings.service";
import { WeatherService } from "app/pages/weather/weather.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  animations: [slideInAnimation],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private alarmService: AlarmsService,
    private firebaseService: FirebaseService,
    private notificationsService: NotificationsService,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    moment.locale("pl");
    this.subscriptions.add(this.settingsService.loadSettings());
    this.notificationsService.subscribeToAll();
    this.subscriptions.add(this.weatherService.getWeather().subscribe());

    this.route.queryParams
      .pipe(first((params) => params["serial"] !== undefined))
      .subscribe((params) => {
        this.firebaseService.setSerial(params["serial"]);
      });

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
