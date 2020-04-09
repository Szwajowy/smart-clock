import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterOutlet, ActivatedRoute } from "@angular/router";
import * as moment from "moment";

import { slideInAnimation } from "./animations";

import { ClockService } from "./shared/services/clock.service";
import { SettingsService } from "./pages/settings/settings.service";
import { ThemeService } from "@shared/services/theme.service";
import { first } from "rxjs/operators";
import { FirebaseService } from "@shared/services/firebase.service";

@Component({
  selector: "app-root",
  animations: [slideInAnimation],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  private notificationsSubscription;
  private weatherSubscription;

  constructor(
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private clockService: ClockService,
    private firebaseService: FirebaseService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    moment.locale("pl");
    this.themeService.loadThemes();
    this.settingsService.subscribeToAll();

    this.route.queryParams
      .pipe(first(params => params["serial"] !== undefined))
      .subscribe(params => {
        this.firebaseService.setSerial(params["serial"]);
      });

    setTimeout(() => {
      this.settingsService.loadSettings();
      this.clockService.fetchAlarmsFromAPI();
    }, 1000);
  }

  ngOnDestroy() {
    this.weatherSubscription.unsubscribe();
    this.notificationsSubscription.unsubscribe();
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData["animation"]
    );
  }
}
