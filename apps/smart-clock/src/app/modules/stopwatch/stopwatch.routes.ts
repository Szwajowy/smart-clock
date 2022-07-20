import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StopwatchComponent } from "./pages/stopwatch/stopwatch.component";

const routes: Routes = [
  {
    path: "stopwatch",
    component: StopwatchComponent,
    data: { animation: "Stopwatch" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class StopwatchRoutesModule {}
