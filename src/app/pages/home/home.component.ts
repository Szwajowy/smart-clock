import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { ApplicationPage } from "@shared/models/application-page.model";
import { Settings } from "@shared/models/settings.model";

import { ClockService } from "app/pages/home/clock.service";
import { FirebaseService } from "@shared/services/firebase.service";
import { WeatherService } from "app/pages/weather/weather.service";
import { SettingsService } from "../settings/settings.service";
import { Timezone } from "@shared/models/timezone.model";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent extends ApplicationPage implements OnInit {
  navigation = {
    top: "/alarms",
    right: "/weather/today",
    bottom: "/stopwatch",
    left: "/settings",
  };

  username = "użytkowniku";
  settings: Settings;
  timezone$: Observable<Timezone>;
  weather$ = this.weatherService.getWeather();

  currentDate$ = this.clockService.getCurrentDate();

  constructor(
    router: Router,
    private clockService: ClockService,
    private settingsService: SettingsService,
    private weatherService: WeatherService,
    private firebaseService: FirebaseService
  ) {
    super(router);
  }

  ngOnInit() {
    this.setUsername();

    this.timezone$ = this.firebaseService.getDeviceData("settings").pipe(
      map((res: any) => {
        return res ? res.timezone : null;
      })
    );

    this.settings = this.settingsService.getSettings();
  }

  setUsername() {
    this.firebaseService.getUserData("name").subscribe((res) => {
      this.username = res;
    });
  }
}
