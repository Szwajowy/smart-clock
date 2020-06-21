import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";

import { Subject } from "rxjs";

import { ThemeService } from "@shared/services/theme.service";
import { WeatherService } from "../../shared/services/weather.service";
import { FirebaseService } from "@shared/services/firebase.service";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private settings = {
    activeTheme: "blue",
    clockStyle: 1,
    city: "Katowice",
    updateTime: 2,
    lastUpdate: new Date().getTime(),
  };

  private settingChanged = new Subject();

  constructor(
    private firebaseService: FirebaseService,
    private themeService: ThemeService,
    private weatherService: WeatherService
  ) {}

  loadSettingsFromLocalStorage() {
    let localSettingsString = localStorage.getItem("settings");
    let localSettings;

    if (localSettingsString) {
      localSettings = JSON.parse(localSettingsString);

      for (let setting of Object.keys(localSettings)) {
        this.settings[setting] = localSettings[setting];
      }
    }

    this.themeService.setActiveTheme(this.settings.activeTheme);
    this.weatherService.setCity(this.settings.city);
    this.weatherService.setRefreshInterval(this.settings.updateTime);
  }

  loadSettings() {
    console.log("Loading settings... ?");
    this.loadSettingsFromLocalStorage();

    this.firebaseService
      .getDeviceData("settings")
      .subscribe((settings: any) => {
        let newSettings;

        if (
          (this.settings &&
            settings &&
            settings.lastUpdate >= this.settings.lastUpdate) ||
          (!this.settings && settings)
        ) {
          console.log(
            "Settings from firebase are newer than local. Getting them..."
          );
          newSettings = settings;

          this.saveSettings();

          for (let setting of Object.keys(newSettings)) {
            this.settings[setting] = newSettings[setting];
          }
        } else if (
          (this.settings &&
            settings &&
            settings.lastUpdate < this.settings.lastUpdate) ||
          (this.settings && !settings)
        ) {
          console.log(
            "Settings from firebase are older than local. Getting local ones..."
          );

          this.putSettingsToFirebase(this.settings);
        }

        this.themeService.setActiveTheme(this.settings.activeTheme);
        this.weatherService.setCity(this.settings.city);
        this.weatherService.setRefreshInterval(this.settings.updateTime);
        this.settingChanged.next();
      });
  }

  saveSettings() {
    console.log("Saving settigns!");
    localStorage.setItem("settings", JSON.stringify(this.settings));
  }

  putSettingsToFirebase(settings) {
    console.log("Pushing new settings to firebase!");
    this.firebaseService.setDeviceData("settings", settings);
  }

  subscribeToAll() {
    this.settingChanged.subscribe(() => {
      this.saveSettings();
      this.putSettingsToFirebase(this.settings);
    });
  }

  setWeatherCity(city: string) {
    console.log("Changed city for which weather is displayed. New city is " + city);
    this.settings.city = city;
    this.settings.lastUpdate = new Date().getTime();
    this.settingChanged.next();

    this.weatherService.setCity(city);
  }

  changeTheme(name: string) {
    this.settings.activeTheme = name;
    this.settings.lastUpdate = new Date().getTime();
    this.themeService.setActiveTheme(name);

    this.settingChanged.next();
  }

  changeClockStyle(id: number) {
    this.settings.clockStyle = id;
    this.settings.lastUpdate = new Date().getTime();

    this.settingChanged.next();
  }

  getSettings() {
    return this.settings;
  }

  getSettingChanged() {
    return this.settingChanged;
  }
}
