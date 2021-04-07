import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import { ClockService } from "app/shared/services/clock.service";
import { FirebaseService } from "@shared/services/firebase.service";
import { map } from "rxjs/operators";
import { SettingsService } from "../settings/settings.service";
import { WeatherService } from "@shared/services/weather.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  username = "użytkowniku";
  clockStyle = 1;

  navigation = {
    top: "/alarms",
    right: "/weather/today",
    bottom: "/stopwatch",
    left: "/settings",
  };

  private now;
  public timezone$;
  public weather$ = this.weatherService.getWeather();
  private momentSubscription;
  private settingsSubscription;

  constructor(
    private clockService: ClockService,
    private weatherService: WeatherService,
    private settingsService: SettingsService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.now = this.clockService.getNow();
    this.clockStyle = this.settingsService.getSettings().clockStyle;
    this.setUsername();

    this.timezone$ = this.firebaseService.getDeviceData("settings").pipe(
      map((res: any) => {
        return res ? res.timezone : null;
      })
    );

    this.momentSubscription = this.clockService
      .getMomentSubject()
      .subscribe((res) => {
        this.now = res;
      });

    this.settingsSubscription = this.settingsService
      .getSettingChanged()
      .subscribe((res) => {
        this.clockStyle = this.settingsService.getSettings().clockStyle;
      });
  }

  ngOnDestroy() {
    this.momentSubscription.unsubscribe();
    this.settingsSubscription.unsubscribe();
  }

  setUsername() {
    this.firebaseService.getUserData("name").subscribe((res) => {
      this.username = res;
    });
  }

  getNow() {
    return this.now;
  }

  onSwipeLeft() {
    if (this.navigation.right) this.router.navigate([this.navigation.right]);
  }

  onSwipeRight() {
    if (this.navigation.left) this.router.navigate([this.navigation.left]);
  }

  onSwipeUp() {
    if (this.navigation.bottom) this.router.navigate([this.navigation.bottom]);
  }

  onSwipeDown() {
    if (this.navigation.top) this.router.navigate([this.navigation.top]);
  }
}
