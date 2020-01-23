import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ThemeService } from 'app/shared/services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public navigation = {
    top: '',
    right: '/',
    bottom: '',
    left: '/calendar'
  };

  public themes = this.themeService.getAvailableThemes();

  public logged = false;

  constructor(private themeService: ThemeService, private router: Router) { }

  ngOnInit() {
  }

  onLogin() {
    this.logged = true;
  }

  onLogout() {
    this.logged = false;
  }

  onThemeChange(name: string) {
    this.themeService.setActiveTheme(name);
  }

  onSwipeLeft() {
    if(this.navigation.right)
      this.router.navigate([this.navigation.right]);
  }

  onSwipeRight() {
    if(this.navigation.left)
    this.router.navigate([this.navigation.left]);
  }

  onSwipeUp() {
    if(this.navigation.bottom)
    this.router.navigate([this.navigation.bottom]);
  }

  onSwipeDown() {
    if(this.navigation.top)
    this.router.navigate([this.navigation.top]);
  }

}
