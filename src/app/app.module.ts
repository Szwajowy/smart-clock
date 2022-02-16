import { registerLocaleData } from "@angular/common";
import localePl from "@angular/common/locales/pl";
import { LOCALE_ID, Injectable, NgModule } from "@angular/core";
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  HammerModule,
} from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../environments/environment";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./pages/home/home.component";
import { NotificationBarComponent } from "./pages/home/notification-bar/notification-bar.component";
import { StopwatchComponent } from "./pages/stopwatch/stopwatch.component";
import { TimerComponent } from "./pages/timer/timer.component";
import { AlarmsComponent } from "./pages/alarms/alarms.component";
import { WeatherComponent } from "./pages/weather/weather.component";
import { CalendarComponent } from "./pages/calendar/calendar.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AlarmFiringComponent } from "./pages/alarm-firing/alarm-firing.component";
import { ThreeDaysForecastComponent } from "./pages/three-days-forecast/three-days-forecast.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { WeatherIconComponent } from "./shared/components/weather-icon/weather-icon.component";
import { StandardComponent } from "./pages/home/clocks/standard/standard.component";
import { BoxyComponent } from "./pages/home/clocks/boxy/boxy.component";
import { WideComponent } from "./pages/home/clocks/wide/wide.component";
import { SunnyComponent } from "./pages/home/clocks/sunny/sunny.component";
import { AlarmComponent } from "./pages/alarms/alarm/alarm.component";
import { AlarmEditComponent } from "./pages/alarms/alarm-edit/alarm-edit.component";
import { NavArrowButtonComponent } from "./shared/components/nav-arrow-button/nav-arrow-button.component";
import { SetTimePartComponent } from "./shared/components/set-time-part/set-time-part.component";
import { PageSkeletonComponent } from "./shared/components/page-skeleton/page-skeleton.component";

import { CapitalizefirstPipe } from "./shared/pipes/capitalizefirst.pipe";
import { DateAgoPipe } from "./shared/pipes/date-ago.pipe";

import * as Hammer from "hammerjs";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getDatabase, provideDatabase } from "@angular/fire/database";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { NgxChartsModule } from "@swimlane/ngx-charts";

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides: { [key: string]: Object } = {
    swipe: { velocity: 0.4, threshold: 10, direction: Hammer.DIRECTION_ALL }, // override default settings
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
    StandardComponent,
    BoxyComponent,
    WideComponent,
    SunnyComponent,
    AlarmComponent,
    AlarmEditComponent,
    NavArrowButtonComponent,
    SetTimePartComponent,
    PageSkeletonComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,
    HttpClientModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    provideAuth(() => getAuth()),
    NgxChartsModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "pl" },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
