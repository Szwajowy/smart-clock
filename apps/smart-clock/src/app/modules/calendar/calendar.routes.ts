import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CalendarComponent } from "./pages/calendar/calendar.component";

const routes: Routes = [
  {
    path: "calendar",
    component: CalendarComponent,
    data: { animation: "Calendar" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class CalendarRoutesModule {}
