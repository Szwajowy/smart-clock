import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AlarmFiringComponent } from "./modules/alarms/pages/alarm-firing/alarm-firing.component";
import { AlarmsComponent } from "./modules/alarms/pages/alarms/alarms.component";
import { SettingsComponent } from "./modules/settings/pages/settings/settings.component";
import { ThreeDaysForecastComponent } from "./modules/weather/pages/three-days-forecast/three-days-forecast.component";

import { OneDayForecastComponent } from "./modules/weather/pages/one-day-forecast/one-day-forecast.component";
import { HomeComponent } from "./modules/home/pages/home/home.component";
import { CalendarComponent } from "./modules/calendar/pages/calendar/calendar.component";
import { StopwatchComponent } from "./modules/stopwatch/pages/stopwatch/stopwatch.component";
import { TimerComponent } from "./modules/timer/pages/timer/timer.component";

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutesModule {}
