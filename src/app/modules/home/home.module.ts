import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SharedModule } from "@shared/shared.module";

import { ClockService } from "./clock.service";
import { BoxyClockStyleComponent } from "./components/boxy-clock-style/boxy-clock-style.component";
import { NotificationBarComponent } from "./components/notification-bar/notification-bar.component";
import { StandardStyleClockComponent } from "./components/standard-clock-style/standard-clock-style.component";
import { SunnyStyleClockComponent } from "./components/sunny-clock-style/sunny-clock-style.component";
import { WideStyleClockComponent } from "./components/wide-clock-style/wide-clock-style.component";
import { HomeRoutesModule } from "./home.routes";
import { NotificationsService } from "./notifications.service";
import { HomeComponent } from "./pages/home/home.component";

@NgModule({
  imports: [BrowserModule, SharedModule, HomeRoutesModule],
  providers: [ClockService, NotificationsService],
  declarations: [
    HomeComponent,
    NotificationBarComponent,
    BoxyClockStyleComponent,
    StandardStyleClockComponent,
    SunnyStyleClockComponent,
    WideStyleClockComponent,
  ],
  exports: [],
})
export class HomeModule {}
