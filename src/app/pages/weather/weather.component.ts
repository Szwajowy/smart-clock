import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { timer, Subscribable, Subscription, interval } from "rxjs";
import { map } from "rxjs/operators";

import { WeatherService } from "../../shared/services/weather.service";

@Component({
  selector: "app-weather",
  templateUrl: "./weather.component.html",
  styleUrls: ["./weather.component.scss"]
})
export class WeatherComponent implements OnInit, OnDestroy {
  public navigation = {
    top: null,
    right: "/calendar",
    bottom: "/weather/tomorrow",
    left: "/"
  };

  public weather$ = this.weatherService.getWeather().pipe(
    map(weather => {
      if (this.route.snapshot.data["weather"] == "today") {
        weather.list[0].updateAt = weather.updateAt;
        weather.list[0].city = weather.city;
        return weather.list[0];
      } else {
        weather.list[1].updateAt = weather.updateAt;
        weather.list[1].city = weather.city;
        return weather.list[1];
      }
    })
  );

  constructor(
    private weatherService: WeatherService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.route.snapshot.data["weather"] == "today") {
      this.navigation.top = "/weather/3days";
      this.navigation.bottom = "/weather/tomorrow";
    } else {
      this.navigation.top = "/weather/today";
      this.navigation.bottom = "/weather/3days";
    }
  }

  ngOnDestroy() {}

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
