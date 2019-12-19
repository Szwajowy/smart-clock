import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './routes/home/home.component';
import { NotificationBarComponent } from './notification-bar/notification-bar.component';
import { StopwatchComponent } from './routes/stopwatch/stopwatch.component';
import { TimerComponent } from './routes/timer/timer.component';
import { AlarmsComponent } from './routes/alarms/alarms.component';
import { WeatherComponent } from './routes/weather/weather.component';
import { CalendarComponent } from './routes/calendar/calendar.component';
import { ReactiveFormsModule } from '@angular/forms';

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
    'swipe': {velocity: 0.4, threshold: 10, direction: Hammer.DIRECTION_ALL} // override default settings
  }
}

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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [{ 
    provide: HAMMER_GESTURE_CONFIG, 
    useClass: MyHammerConfig 
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
