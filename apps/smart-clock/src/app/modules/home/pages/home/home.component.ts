import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ApplicationPage } from '@shared/models/application-page.model';
import { Settings } from '@shared/models/settings.model';

import { SettingsService } from 'app/modules/settings/settings.service';
import { FirebaseService } from 'app/core/services/firebase.service';
import { WeatherService } from 'app/modules/weather/weather.service';
import { ClockService } from '../../clock.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends ApplicationPage implements OnInit {
  navigation = {
    top: '/alarms',
    right: '/weather/today',
    bottom: '/stopwatch',
    left: '/settings',
  };

  username = 'użytkowniku';
  settings$: Observable<Settings>;
  weather$;
  currentDate$: Observable<Date>;

  constructor(
    router: Router,
    private clockService: ClockService,
    private settingsService: SettingsService,
    private weatherService: WeatherService,
    private firebaseService: FirebaseService
  ) {
    super(router);
    this.settings$ = this.settingsService.settings$;
    this.weather$ = this.weatherService.getWeather();
    this.currentDate$ = this.clockService.currentDate$;
  }

  ngOnInit() {
    this.setUsername();
  }

  setUsername() {
    this.firebaseService.getUserData('name').subscribe((res) => {
      this.username = res;
    });
  }
}
