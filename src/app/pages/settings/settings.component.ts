import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { ThemeService } from "app/shared/services/theme.service";
import { SettingsService } from "./settings.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
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
    private router: Router
  ) {}

  onLogin() {
    this.logged = true;
  }

  onLogout() {
    this.logged = false;
  }

  onThemeChange(name: string) {
    this.settingsService.changeTheme(name);
  }

  onClockStyleChange(id: number) {
    this.settingsService.changeClockStyle(id);
  }

  getSettings() {
    return this.settingsService.getSettings();
  }

  onSwipeLeft() {
    if (this.navigation.right) this.router.navigate([this.navigation.right]);
  }

  onSwipeRight() {
    if (this.navigation.left) this.router.navigate([this.navigation.left]);
  }

  onSwipeUp() {
    if (this.navigation.bottom) this.router.navigate([this.navigation.bottom]);
  }

  onSwipeDown() {
    if (this.navigation.top) this.router.navigate([this.navigation.top]);
  }
}
