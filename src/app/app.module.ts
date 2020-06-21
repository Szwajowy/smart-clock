import localePl from "@angular/common/locales/pl";
import { LOCALE_ID } from "@angular/core";
import { registerLocaleData } from "@angular/common";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { environment } from "../environments/environment";

import * as Hammer from "hammerjs";
import {
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG
} from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./pages/home/home.component";
import { NotificationBarComponent } from "./shared/components/notification-bar/notification-bar.component";
import { StopwatchComponent } from "./pages/stopwatch/stopwatch.component";
import { TimerComponent } from "./pages/timer/timer.component";
import { AlarmsComponent } from "./pages/alarms/alarms.component";
import { WeatherComponent } from "./pages/weather/weather.component";
import { CalendarComponent } from "./pages/calendar/calendar.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AlarmFiringComponent } from "./pages/alarm-firing/alarm-firing.component";
import { ThreeDaysForecastComponent } from "./pages/three-days-forecast/three-days-forecast.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { CapitalizefirstPipe } from "./shared/pipes/capitalizefirst.pipe";
import { WeatherIconComponent } from "./shared/components/weather-icon/weather-icon.component";
import { DateAgoPipe } from './shared/pipes/date-ago.pipe';
import { AlarmComponent } from './pages/alarms/components/alarm/alarm.component';
import { StandartComponent } from './pages/home/clocks/standart/standart.component';
import { BoxyComponent } from './pages/home/clocks/boxy/boxy.component';
import { WideComponent } from './pages/home/clocks/wide/wide.component';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { velocity: 0.4, threshold: 10, direction: Hammer.DIRECTION_ALL } // override default settings
  };
}

registerLocaleData(localePl);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotificationBarComponent,
    StopwatchComponent,
    TimerComponent,
    AlarmsComponent,
    WeatherComponent,
    CalendarComponent,
    AlarmFiringComponent,
    ThreeDaysForecastComponent,
    SettingsComponent,
    CapitalizefirstPipe,
    WeatherIconComponent,
    DateAgoPipe,
    AlarmComponent,
    StandartComponent,
    BoxyComponent,
    WideComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pl" },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
