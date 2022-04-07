import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { SharedModule } from "@shared/shared.module";
import { SettingsComponent } from "./pages/settings/settings.component";
import { SettingsRoutesModule } from "./settings.routes";
import { SettingsService } from "./settings.service";

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    ReactiveFormsModule,
    SettingsRoutesModule,
  ],
  providers: [SettingsService],
  declarations: [SettingsComponent],
  exports: [],
})
export class SettingsModule {}
