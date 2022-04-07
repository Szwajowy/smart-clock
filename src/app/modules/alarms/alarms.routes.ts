import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AlarmFiringComponent } from "./pages/alarm-firing/alarm-firing.component";
import { AlarmsComponent } from "./pages/alarms/alarms.component";

const routes: Routes = [
  {
    path: "alarmFiring",
    component: AlarmFiringComponent,
    data: { animation: "AlarmFiring" },
  },
  { path: "alarms", component: AlarmsComponent, data: { animation: "Alarms" } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AlarmRoutesModule {}
