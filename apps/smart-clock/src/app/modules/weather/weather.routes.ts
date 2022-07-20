import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OneDayForecastComponent } from "./pages/one-day-forecast/one-day-forecast.component";
import { ThreeDaysForecastComponent } from "./pages/three-days-forecast/three-days-forecast.component";

const routes: Routes = [
  {
    path: "weather/today",
    component: OneDayForecastComponent,
    data: { animation: "WeatherToday", weather: "today" },
  },
  {
    path: "weather/tomorrow",
    component: OneDayForecastComponent,
    data: { animation: "WeatherTomorrow", weather: "tomorrow" },
  },
  {
    path: "weather/3days",
    component: ThreeDaysForecastComponent,
    data: { animation: "WeatherThreeDays" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class WeatherRoutesModule {}
