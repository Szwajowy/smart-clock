import { registerLocaleData } from "@angular/common";
import localePl from "@angular/common/locales/pl";
import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AlarmsModule } from "./modules/alarms/alarms.module";
import { AppRoutesModule } from "./app.routes";
import { CalendarModule } from "./modules/calendar/calendar.module";
import { CoreModule } from "./core/core.module";
import { HomeModule } from "./modules/home/home.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { SharedModule } from "@shared/shared.module";
import { StopwatchModule } from "./modules/stopwatch/stopwatch.module";
import { TimerModule } from "./modules/timer/timer.module";
import { WeatherModule } from "./modules/weather/weather.module";

import { AppComponent } from "./app.component";

registerLocaleData(localePl);

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutesModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AlarmsModule,
    CalendarModule,
    HomeModule,
    SettingsModule,
    StopwatchModule,
    TimerModule,
    WeatherModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: "pl" }],
  bootstrap: [AppComponent],
})
export class AppModule {}
