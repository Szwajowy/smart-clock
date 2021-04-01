import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { map } from "rxjs/operators";

import { WeatherService } from "../../shared/services/weather.service";

@Component({
  selector: "app-weather",
  templateUrl: "./weather.component.html",
  styleUrls: ["./weather.component.scss"],
})
export class WeatherComponent implements OnInit, OnDestroy {
  public navigation = {
    top: null,
    right: "/calendar",
    bottom: "/weather/tomorrow",
    left: "/",
  };

  public weather$ = this.weatherService.getWeather().pipe(
    map((weather) => {
      if (weather === null) return null;

      let newWeather = JSON.parse(JSON.stringify(weather));
      let newList = [weather.list[0]];
      let firstDate = new Date(weather.list[0].dt * 1000);

      for (let i = 1; i < weather.list.length; i++) {
        let date = new Date(weather.list[i].dt * 1000);
        if (date.getDay() !== firstDate.getDay() && date.getUTCHours() === 12) {
          newList.push(weather.list[i]);
        }
      }

      newWeather.list = newList;

      if (this.route.snapshot.data["weather"] == "today") {
        newWeather.list[0].updateAt = newWeather.updatedAt;
        newWeather.list[0].city = newWeather.city;
        return newWeather.list[0];
      } else {
        newWeather.list[1].updateAt = newWeather.updatedAt;
        newWeather.list[1].city = newWeather.city;
        return newWeather.list[1];
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

  onRefreshWeather() {
    this.weatherService.refreshWeather();
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
