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
  settings$: Observable<Settings> = this.settingsService.settings$;
  weather$ = this.weatherService.getWeather();

  currentDate$ = this.clockService.currentDate$;

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
  }

  setUsername() {
    this.firebaseService.getUserData("name").subscribe((res) => {
      this.username = res;
    });
  }
}
