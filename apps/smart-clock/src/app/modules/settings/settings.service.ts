import { Injectable } from "@angular/core";

import { BehaviorSubject, combineLatest, Subscription } from "rxjs";
import { first } from "rxjs/operators";

import { FirebaseService } from "app/core/services/firebase.service";
import { WeatherService } from "../weather/weather.service";
import { ThemeService } from "app/core/services/theme.service";
import { ClockStyle } from "@shared/models/clock-style.model";
import { ThemeName } from "@shared/models/theme-name.enum";
import { Settings } from "@shared/models/settings.model";
import { SetDeviceBacklightBrightnessService } from "app/core/http/device/set-device-backlight-brightness.service";

@Injectable()
export class SettingsService {
  private defaultSettings: Settings = {
    activeTheme: ThemeName.blue,
    brightness: 50,
    clockStyle: ClockStyle.standard,
    city: "Katowice",
    updateTime: 2,
    timezone: {
      name: "Europe/Warsaw",
      offset: "+02:00",
    },
    lastUpdate: new Date().getTime(),
  };

  readonly settings$: BehaviorSubject<Settings> = new BehaviorSubject(
    this.defaultSettings
  );

  constructor(
    private firebaseService: FirebaseService,
    private setDeviceBacklightBrightnessService: SetDeviceBacklightBrightnessService,
    private themeService: ThemeService,
    private weatherService: WeatherService
  ) {}

  private async loadSettingsFromLocalStorage(): Promise<Settings> {
    const localStorageSettings = localStorage.getItem("settings");
    let parsedSettings: object;
    const settings = await this.getCurrentSettings();

    if (localStorageSettings) {
      parsedSettings = JSON.parse(localStorageSettings);

      for (const setting of Object.keys(parsedSettings)) {
        settings[setting] = parsedSettings[setting];
      }
    }

    return settings;
  }

  loadSettings(): Subscription {
    let settings: Settings;

    return combineLatest({
      firebaseSettings: this.firebaseService.getDeviceData("settings"),
      localSettings: this.loadSettingsFromLocalStorage(),
    }).subscribe(
      ({
        firebaseSettings,
        localSettings,
      }: {
        firebaseSettings: Settings;
        localSettings: Settings;
      }) => {
        if (
          firebaseSettings?.lastUpdate >= localSettings?.lastUpdate ||
          (!localSettings && firebaseSettings)
        ) {
          settings = firebaseSettings;
          this.saveSettingsToLocalStorage(firebaseSettings);
        } else if (
          firebaseSettings?.lastUpdate < localSettings?.lastUpdate ||
          (localSettings && !firebaseSettings)
        ) {
          settings = localSettings;
          this.putSettingsToFirebase(localSettings);
        }

        this.settings$.next(settings);
        this.setDeviceBacklightBrightnessService
          .setDeviceBacklightBrightness(settings.brightness)
          .subscribe();
        this.themeService.setTheme(settings.activeTheme);
        this.weatherService.setCity(settings.city);
      }
    );
  }

  async setWeatherCity(city: string): Promise<void> {
    const settings = await this.getCurrentSettings();

    settings.city = city;
    this.weatherService.setCity(city);

    this.updateSettings(settings);
  }

  async setTheme(name: ThemeName): Promise<void> {
    const settings = await this.getCurrentSettings();
    settings.activeTheme = name;
    this.themeService.setTheme(name);
    this.updateSettings(settings);
  }

  async setClockStyle(id: number): Promise<void> {
    const settings = await this.getCurrentSettings();
    settings.clockStyle = id;

    this.updateSettings(settings);
  }

  async setBrightness(value: number): Promise<void> {
    const settings = await this.getCurrentSettings();

    this.setDeviceBacklightBrightnessService
      .setDeviceBacklightBrightness(value)
      .subscribe((response: { brightness: number }) => {
        settings.brightness = value;
        this.updateSettings(settings);
      });
  }

  private async getCurrentSettings(): Promise<Settings> {
    return await this.settings$.pipe(first()).toPromise();
  }

  private updateSettings(settings: Settings): void {
    settings.lastUpdate = new Date().getTime();
    this.settings$.next(settings);
    this.saveSettingsToLocalStorage(settings);
    this.putSettingsToFirebase(settings);
  }

  private saveSettingsToLocalStorage(settings: Settings): void {
    localStorage.setItem("settings", JSON.stringify(settings));
  }

  private putSettingsToFirebase(settings): void {
    this.firebaseService.setDeviceData("settings", settings);
  }
}
