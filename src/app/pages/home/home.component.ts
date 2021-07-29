import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Store } from "@ngrx/store";

import { ApplicationPage } from "@shared/models/application-page.model";
import { Settings } from "@shared/models/settings.model";

import { ClockService } from "app/pages/home/clock.service";
import { FirebaseService } from "@shared/services/firebase.service";
import { WeatherService } from "app/pages/weather/weather.service";

import * as fromApp from "app/store/app.reducer";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent
  extends ApplicationPage
  implements OnInit, OnDestroy
{
  navigation = {
    top: "/alarms",
    right: "/weather/today",
    bottom: "/stopwatch",
    left: "/settings",
  };

  username = "użytkowniku";
  settings: Observable<Settings>;
  timezone$;
  weather$ = this.weatherService.getWeather();

  private now;
  private momentSubscription;

  constructor(
    router: Router,
    private clockService: ClockService,
    private weatherService: WeatherService,
    private firebaseService: FirebaseService,
    private store: Store<fromApp.AppState>
  ) {
    super(router);
  }

  ngOnInit() {
    this.settings = this.store.select("settings");
    this.now = this.clockService.getNow();
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
  }

  ngOnDestroy() {
    this.momentSubscription.unsubscribe();
  }

  setUsername() {
    this.firebaseService.getUserData("name").subscribe((res) => {
      this.username = res;
    });
  }

  getNow() {
    return this.now;
  }
}
