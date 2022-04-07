import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { SharedModule } from "@shared/shared.module";
import { StopwatchComponent } from "./pages/stopwatch/stopwatch.component";
import { StopwatchRoutesModule } from "./stopwatch.routes";
import { StopwatchService } from "./stopwatch.service";

@NgModule({
  imports: [BrowserModule, SharedModule, StopwatchRoutesModule],
  providers: [StopwatchService],
  declarations: [StopwatchComponent],
  exports: [],
})
export class StopwatchModule {}
