import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SettingsComponent } from "./pages/settings/settings.component";

const routes: Routes = [
  {
    path: "settings",
    component: SettingsComponent,
    data: { animation: "Settings" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class SettingsRoutesModule {}
