import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { ApplicationPage } from "@shared/models/application-page.model";
import { TimerService } from "../../timer.service";

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.scss"],
})
export class TimerComponent extends ApplicationPage {
  public navigation = {
    top: "/stopwatch",
    right: "/weather/today",
    bottom: "/alarms",
    left: "/calendar",
  };

  constructor(router: Router, public timerService: TimerService) {
    super(router);
  }

  setTime(value, part) {
    this.timerService.time[part] = value;
  }
}
