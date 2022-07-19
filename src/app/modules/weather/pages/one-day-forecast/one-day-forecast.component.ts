import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApplicationPage } from "@shared/models/application-page.model";

import { map } from "rxjs/operators";
import { WeatherService } from "../../weather.service";

@Component({
  selector: "app-weather",
  templateUrl: "./one-day-forecast.component.html",
  styleUrls: ["./one-day-forecast.component.scss"],
})
export class OneDayForecastComponent
  extends ApplicationPage
  implements OnInit, OnDestroy
{
  public navigation = {
    top: null,
    right: "/calendar",
    bottom: "/weather/tomorrow",
    left: "/",
  };

  weather$ = this.weatherService.getWeather();
  public todayWeather$ = this.weatherService.getWeather().pipe(
    map((weather) => {
      if (weather === null) return null;

      const newWeather = JSON.parse(JSON.stringify(weather));
      const newList = [weather.list[0]];
      const firstDate = new Date(weather.list[0].dt * 1000);

      for (let i = 1; i < weather.list.length; i++) {
        const date = new Date(weather.list[i].dt * 1000);
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
    router: Router,
    public route: ActivatedRoute,
    private weatherService: WeatherService
  ) {
    super(router);
  }

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
}
