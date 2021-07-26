import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { StopwatchComponent } from "./pages/stopwatch/stopwatch.component";
import { TimerComponent } from "./pages/timer/timer.component";
import { AlarmsComponent } from "./pages/alarms/alarms.component";
import { WeatherComponent } from "./pages/weather/weather.component";
import { CalendarComponent } from "./pages/calendar/calendar.component";
import { AlarmFiringComponent } from "./pages/alarm-firing/alarm-firing.component";
import { ThreeDaysForecastComponent } from "./pages/three-days-forecast/three-days-forecast.component";
import { SettingsComponent } from "./pages/settings/settings.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomeComponent,
    data: { animation: "Clock" }
  },
  {
    path: "alarmFiring",
    component: AlarmFiringComponent,
    data: { animation: "AlarmFiring" }
  },
  {
    path: "stopwatch",
    component: StopwatchComponent,
    data: { animation: "Stopwatch" }
  },
  { path: "timer", component: TimerComponent, data: { animation: "Timer" } },
  { path: "alarms", component: AlarmsComponent, data: { animation: "Alarms" } },
  {
    path: "weather/today",
    component: WeatherComponent,
    data: { animation: "WeatherToday", weather: "today" }
  },
  {
    path: "weather/tomorrow",
    component: WeatherComponent,
    data: { animation: "WeatherTomorrow", weather: "tomorrow" }
  },
  {
    path: "weather/3days",
    component: ThreeDaysForecastComponent,
    data: { animation: "WeatherThreeDays" }
  },
  {
    path: "calendar",
    component: CalendarComponent,
    data: { animation: "Calendar" }
  },
  {
    path: "settings",
    component: SettingsComponent,
    data: { animation: "Settings" }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
