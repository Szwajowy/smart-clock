import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ApplicationPage } from "@shared/models/application-page.model";
import { ThemeName } from "@shared/models/theme-name.enum";

import { ThemeService } from "app/shared/services/theme.service";
import { SettingsService } from "./settings.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent extends ApplicationPage {
  public navigation = {
    top: "",
    right: "/",
    bottom: "",
    left: "/calendar",
  };

  public themes = this.themeService.availableThemes$;
  public logged = false;

  constructor(
    private settingsService: SettingsService,
    private themeService: ThemeService,
    router: Router
  ) {
    super(router);
  }

  onLogin() {
    this.logged = true;
  }

  onLogout() {
    this.logged = false;
  }

  onThemeChange(name: ThemeName) {
    this.settingsService.changeTheme(name);
  }

  onClockStyleChange(id: number) {
    this.settingsService.changeClockStyle(id);
  }

  getSettings() {
    return this.settingsService.getSettings();
  }
}
