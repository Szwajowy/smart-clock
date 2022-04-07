import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { SharedModule } from "@shared/shared.module";
import { TimerComponent } from "./pages/timer/timer.component";
import { TimerRoutesModule } from "./timer.routes";
import { TimerService } from "./timer.service";

@NgModule({
  imports: [BrowserModule, SharedModule, TimerRoutesModule],
  providers: [TimerService],
  declarations: [TimerComponent],
  exports: [],
})
export class TimerModule {}
