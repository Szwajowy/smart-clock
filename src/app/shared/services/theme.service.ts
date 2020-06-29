import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";

import { Subject } from "rxjs";

import { Theme } from "../models/theme.model";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private active: Theme;

  private availableThemes: Theme[] = [];
  public availableThemes$ = this.firebaseDb
    .list("themes")
    .valueChanges()
    .pipe(
      tap((themes: Theme[]) => {
        this.availableThemes = themes;
      })
    );

  private activeSubject = new Subject();

  constructor(private firebaseDb: AngularFireDatabase) {}

  loadThemes() {
    this.firebaseDb
      .list("themes")
      .valueChanges()
      .subscribe((themes: Theme[]) => {
        this.availableThemes = themes;
      });
  }

  findTheme(name) {
    let foundTheme = null;

    this.availableThemes.forEach((theme) => {
      if (theme.name === name) foundTheme = theme;
    });

    return foundTheme;
  }

  getAvailableThemes(): Theme[] {
    return this.availableThemes;
  }

  setAvailableThemes(themes: Theme[]) {
    this.availableThemes = themes;
  }

  getActiveTheme(): Theme {
    return this.active;
  }

  setActiveTheme(name: string): void {
    let theme = this.findTheme(name);

    if (!theme) return null;

    this.active = theme;

    this.setCSSProperties();

    this.activeSubject.next(this.active);
  }

  private setCSSProperties() {
    Object.keys(this.active.properties).forEach((property) => {
      document.documentElement.style.setProperty(
        "--" + property,
        this.active.properties[property]
      );
    });
  }

  getActiveSubject() {
    return this.activeSubject;
  }
}
