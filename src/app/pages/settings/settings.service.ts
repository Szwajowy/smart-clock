import { Injectable } from "@angular/core";
import { ClockStyle } from "@shared/models/clock-style.enum";
import { Settings } from "@shared/models/settings.model";
import { ThemeName } from "@shared/models/theme-name.enum";
import { DeviceSettingsService } from "@shared/services/device-settings.service";
import { FirebaseService } from "@shared/services/firebase.service";
import { ThemeService } from "@shared/services/theme.service";
import { BehaviorSubject, combineLatest, Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { WeatherService } from "../weather/weather.service";

@Injectable({
  providedIn: "root",
})
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
    private deviceSettingsService: DeviceSettingsService,
    private themeService: ThemeService,
    private weatherService: WeatherService
  ) {}

  private async loadSettingsFromLocalStorage(): Promise<Settings> {
    let localStorageSettings = localStorage.getItem("settings");
    let parsedSettings: {};
    let settings = await this.getCurrentSettings();

    if (localStorageSettings) {
      parsedSettings = JSON.parse(localStorageSettings);

      for (let setting of Object.keys(parsedSettings)) {
        settings[setting] = parsedSettings[setting];
      }
    }

    return settings;
  }

  loadSettings(): Subscription {
    console.log("Loading settings... ?");
    let settings: Settings;

    return combineLatest([
      this.firebaseService.getDeviceData("settings"),
      this.loadSettingsFromLocalStorage(),
    ]).subscribe(([firebaseSettings, localSettings]: [Settings, Settings]) => {
      if (
        firebaseSettings?.lastUpdate >= localSettings?.lastUpdate ||
        (!localSettings && firebaseSettings)
      ) {
        console.log(
          "Settings from firebase are newer than local. Getting them..."
        );

        settings = firebaseSettings;
        this.saveSettingsToLocalStorage(firebaseSettings);
      } else if (
        firebaseSettings?.lastUpdate < localSettings?.lastUpdate ||
        (localSettings && !firebaseSettings)
      ) {
        console.log(
          "Settings from firebase are older than local. Getting local ones..."
        );

        settings = localSettings;
        this.putSettingsToFirebase(localSettings);
      }

      this.settings$.next(settings);
      this.themeService.setTheme(settings.activeTheme);
    });
  }

  async setWeatherCity(city: string): Promise<void> {
    let settings = await this.getCurrentSettings();

    settings.city = city;
    this.weatherService.setCity(city);

    this.updateSettings(settings);
  }

  async setTheme(name: ThemeName): Promise<void> {
    let settings = await this.getCurrentSettings();
    settings.activeTheme = name;
    this.themeService.setTheme(name);
    this.updateSettings(settings);
  }

  async setClockStyle(id: number): Promise<void> {
    let settings = await this.getCurrentSettings();
    settings.clockStyle = id;

    this.updateSettings(settings);
  }

  async setBrightness(value: number): Promise<void> {
    let settings = await this.getCurrentSettings();

    this.deviceSettingsService.setDeviceBacklightBrightness(value);
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
    console.log("Saving settings!");
    localStorage.setItem("settings", JSON.stringify(settings));
  }

  private putSettingsToFirebase(settings): void {
    console.log("Pushing new settings to firebase!");
    this.firebaseService.setDeviceData("settings", settings);
  }
}
