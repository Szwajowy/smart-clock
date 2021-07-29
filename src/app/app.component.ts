import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterOutlet, ActivatedRoute } from "@angular/router";
import { first } from "rxjs/operators";
import * as moment from "moment";

import { slideInAnimation } from "./animations";

import { AlarmsService } from "./pages/alarms/alarms.service";
import { ClockService } from "./pages/home/clock.service";
import { FirebaseService } from "@shared/services/firebase.service";
import { NotificationsService } from "app/pages/home/notification-bar/notifications.service";
import { ThemeService } from "@shared/services/theme.service";
import { SettingsService } from "./pages/settings/settings.service";
import { WeatherService } from "app/pages/weather/weather.service";

@Component({
  selector: "app-root",
  animations: [slideInAnimation],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  private alarmsSubscription;
  private notificationsSubscription;
  private weatherSubscription;

  constructor(
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private alarmService: AlarmsService,
    private clockService: ClockService,
    private firebaseService: FirebaseService,
    private notificationsService: NotificationsService,
    private weatherService: WeatherService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    moment.locale("pl");
    this.themeService.loadThemes();
    this.settingsService.subscribeToAll();
    this.notificationsService.subscribeToAll();
    this.weatherSubscription = this.weatherService.getWeather().subscribe();

    this.route.queryParams
      .pipe(first((params) => params["serial"] !== undefined))
      .subscribe((params) => {
        this.firebaseService.setSerial(params["serial"]);
      });

    setTimeout(() => {
      this.settingsService.loadSettings();
      this.alarmsSubscription = this.alarmService.fetchAlarmsFromDb().subscribe();
    }, 1000);
  }

  ngOnDestroy() {
    this.alarmsSubscription.unsubscribe();
    this.notificationsSubscription.unsubscribe();
    this.weatherSubscription.unsubscribe();
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData["animation"]
    );
  }
}
