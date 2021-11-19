import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";

import { Observable, Subject } from "rxjs";
import { first } from "rxjs/operators";

import { Theme } from "../models/theme.model";
import { ThemeName } from "@shared/models/theme-name.enum";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  readonly availableThemes$: Observable<Theme[]> = this.firebaseDb
    .list<Theme>("themes")
    .valueChanges();
  readonly activeTheme$: Subject<null> = new Subject();

  constructor(private firebaseDb: AngularFireDatabase) {}

  async setTheme(name: ThemeName): Promise<void> {
    let theme: Theme = await this.findTheme(name);

    if (!theme) {
      throw new Error("No such theme exist!");
    }

    this.setCSSProperties(theme);
  }

  private async findTheme(name): Promise<Theme | null> {
    let foundTheme = null;

    const availableThemes: Theme[] = await this.availableThemes$
      .pipe(first())
      .toPromise();

    availableThemes.forEach((theme) => {
      if (theme.name === name) foundTheme = theme;
    });

    return foundTheme;
  }

  private setCSSProperties(theme: Theme): void {
    Object.keys(theme.properties).forEach((property) => {
      document.documentElement.style.setProperty(
        "--" + property,
        theme.properties[property]
      );
    });
    this.activeTheme$.next();
  }
}
