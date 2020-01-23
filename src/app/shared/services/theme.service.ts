import { Injectable } from '@angular/core';
import { Theme, blue, purple, pink, violet } from './themes';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private active: Theme = blue;
  private availableThemes: Theme[] = [ blue, purple, pink, violet ];

  constructor() { }

  getAvailableThemes(): Theme[] {
    return this.availableThemes;
  }

  getActiveTheme(): Theme {
    return this.active;
  }

  findTheme(name) {
    let foundTheme = null;

    this.availableThemes.forEach(theme => {
      if(theme.name === name)
        foundTheme = theme;
    });

    return foundTheme;
  }

  setActiveTheme(name: string): void {
    let theme = this.findTheme(name);

    if(!theme) return null;

    this.active = theme;

    Object.keys(this.active.properties).forEach(property => {
      document.documentElement.style.setProperty(
        "--" + property,
        this.active.properties[property]
      );
    });
  }
}
