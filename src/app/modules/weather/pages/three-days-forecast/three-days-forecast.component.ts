import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import * as moment from "moment";

import { WeatherService } from "../../weather.service";
import { ApplicationPage } from "@shared/models/application-page.model";

@Component({
  selector: "app-three-days-forecast",
  templateUrl: "./three-days-forecast.component.html",
  styleUrls: ["./three-days-forecast.component.scss"],
})
export class ThreeDaysForecastComponent extends ApplicationPage {
  public navigation = {
    top: "/weather/tomorrow",
    right: "/calendar",
    bottom: "/weather/today",
    left: "/",
  };

  public weather$ = this.weatherService.getWeather().pipe(
    map((weather) => {
      let newWeather = JSON.parse(JSON.stringify(weather));
      const newList = [weather.list[0]];
      for (let i = 1; i < weather.list.length; i++) {
        const date = new Date(weather.list[i].dt * 1000);
        if (date.getUTCHours() === 12) {
          newList.push(weather.list[i]);
        }
      }

      newWeather.list = newList;

      newWeather = newWeather.list.slice(2, 5);
      for (let i = 0; i < newWeather.length; i++) {
        newWeather[i].weekday = moment.unix(newWeather[i].dt).weekday();
      }

      return newWeather;
    })
  );

  constructor(router: Router, private weatherService: WeatherService) {
    super(router);
  }

  getWeekday(dayNumber) {
    switch (dayNumber) {
      case 0:
        return "Pon";
      case 1:
        return "Wt";
      case 2:
        return "Śr";
      case 3:
        return "Czw";
      case 4:
        return "Pt";
      case 5:
        return "Sob";
      case 6:
        return "Nd";
    }
  }

  onRefreshWeather() {
    this.weatherService.refreshWeather();
  }
}
