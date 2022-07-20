import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SharedModule } from "@shared/shared.module";
import { CalendarRoutesModule } from "./calendar.routes";
import { CalendarService } from "./calendar.service";
import { CalendarComponent } from "./pages/calendar/calendar.component";

@NgModule({
  imports: [BrowserModule, SharedModule, CalendarRoutesModule],
  providers: [CalendarService],
  declarations: [CalendarComponent],
  exports: [],
})
export class CalendarModule {}
