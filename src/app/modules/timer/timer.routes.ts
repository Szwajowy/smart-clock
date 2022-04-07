import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TimerComponent } from "./pages/timer/timer.component";

const routes: Routes = [
  { path: "timer", component: TimerComponent, data: { animation: "Timer" } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class TimerRoutesModule {}
