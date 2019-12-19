import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { StopwatchComponent } from './routes/stopwatch/stopwatch.component';
import { TimerComponent } from './routes/timer/timer.component';
import { AlarmsComponent } from './routes/alarms/alarms.component';
import { WeatherComponent } from './routes/weather/weather.component';
import { CalendarComponent } from './routes/calendar/calendar.component';

const routes: Routes = [
  { path: '', pathMatch: 'full',  component: HomeComponent, data: {animation: 'Clock'}},
  { path: 'stopwatch',  component: StopwatchComponent, data: {animation: 'Stopwatch'}},
  { path: 'timer',  component: TimerComponent, data: {animation: 'Timer'}},
  { path: 'alarms',  component: AlarmsComponent, data: {animation: 'Alarms'}},
  { path: 'weather/today',  component: WeatherComponent, data: {animation: 'WeatherToday', weather: 'today'}},
  { path: 'weather/tomorrow',  component: WeatherComponent, data: {animation: 'WeatherTomorrow', weather: 'tomorrow'}},
  { path: 'calendar',  component: CalendarComponent, data: {animation: 'Calendar'}},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
