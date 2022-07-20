import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { NavArrowButtonComponent } from "./components/nav-arrow-button/nav-arrow-button.component";
import { PageSkeletonComponent } from "./components/page-skeleton/page-skeleton.component";
import { SetTimePartComponent } from "./components/set-time-part/set-time-part.component";
import { WeatherIconComponent } from "./components/weather-icon/weather-icon.component";
import { CapitalizefirstPipe } from "./pipes/capitalizefirst.pipe";
import { DateAgoPipe } from "./pipes/date-ago.pipe";

@NgModule({
  imports: [BrowserModule, RouterModule],
  providers: [],
  declarations: [
    NavArrowButtonComponent,
    PageSkeletonComponent,
    WeatherIconComponent,
    SetTimePartComponent,
    CapitalizefirstPipe,
    DateAgoPipe,
  ],
  exports: [
    NavArrowButtonComponent,
    PageSkeletonComponent,
    WeatherIconComponent,
    SetTimePartComponent,
    CapitalizefirstPipe,
    DateAgoPipe,
  ],
})
export class SharedModule {}
