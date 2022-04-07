import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ApplicationPage } from "@shared/models/application-page.model";
import { Settings } from "@shared/models/settings.model";
import { ThemeName } from "@shared/models/theme-name.enum";
import { Theme } from "@shared/models/theme.model";
import { ThemeService } from "app/core/services/theme.service";

import { Observable, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { SettingsService } from "../../settings.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent
  extends ApplicationPage
  implements OnInit, OnDestroy
{
  public navigation = {
    top: "",
    right: "/",
    bottom: "",
    left: "/calendar",
  };

  public clockStyles = ["1", "2", "3", "4"];
  public availableThemes$: Observable<Theme[]> =
    this.themeService.availableThemes$;
  public settings$: Observable<Settings> = this.settingsService.settings$;
  public settingsForm: FormGroup;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private themeService: ThemeService,
    router: Router
  ) {
    super(router);
  }

  ngOnInit() {
    this.settingsForm = this.fb.group({
      activeTheme: [],
      activeClockStyle: [],
      screenBrightness: [],
    });

    this.subscriptions.add(
      this.settings$.subscribe((settings: Settings) => {
        this.settingsForm.setValue(
          {
            activeTheme: settings.activeTheme,
            activeClockStyle: settings.clockStyle.toString(),
            screenBrightness: settings.brightness,
          },
          { emitEvent: false }
        );
      })
    );

    this.subscriptions.add(
      this.settingsForm
        .get("activeTheme")
        .valueChanges.subscribe((activeTheme: ThemeName) => {
          this.settingsService.setTheme(activeTheme);
        })
    );
    this.subscriptions.add(
      this.settingsForm
        .get("activeClockStyle")
        .valueChanges.subscribe((activeClockStyle: number) => {
          this.settingsService.setClockStyle(activeClockStyle);
        })
    );
    this.subscriptions.add(
      this.settingsForm
        .get("screenBrightness")
        .valueChanges.pipe(debounceTime(200))
        .subscribe((brightness: number) => {
          this.settingsService.setBrightness(brightness);
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
