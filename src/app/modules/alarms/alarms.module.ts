import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SharedModule } from "@shared/shared.module";
import { AlarmRoutesModule } from "./alarms.routes";

import { AlarmsService } from "./alarms.service";
import { AlarmEditComponent } from "./components/alarm-edit/alarm-edit.component";
import { AlarmComponent } from "./components/alarm/alarm.component";
import { AlarmFiringComponent } from "./pages/alarm-firing/alarm-firing.component";
import { AlarmsComponent } from "./pages/alarms/alarms.component";

@NgModule({
  imports: [BrowserModule, SharedModule, AlarmRoutesModule],
  providers: [AlarmsService],
  declarations: [
    AlarmFiringComponent,
    AlarmsComponent,
    AlarmComponent,
    AlarmComponent,
    AlarmEditComponent,
  ],
  exports: [],
})
export class AlarmsModule {}
