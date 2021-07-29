import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { ApplicationPage } from "@shared/models/application-page.model";

import { ClockService } from "app/pages/home/clock.service";
import { StopwatchService } from "app/pages/stopwatch/stopwatch.service";

@Component({
  selector: "app-stopwatch",
  templateUrl: "./stopwatch.component.html",
  styleUrls: ["./stopwatch.component.scss"],
})
export class StopwatchComponent extends ApplicationPage {
  public navigation = {
    top: "/",
    right: "/weather/today",
    bottom: "/timer",
    left: "/calendar",
  };

  constructor(router: Router, public stopwatchService: StopwatchService) {
    super(router);
  }
}
