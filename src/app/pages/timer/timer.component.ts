import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { TimerService } from "app/shared/services/timer.service";

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.scss"],
})
export class TimerComponent {
  public navigation = {
    top: "/stopwatch",
    right: "/weather/today",
    bottom: "/alarms",
    left: "/calendar",
  };

  constructor(public timerService: TimerService, private router: Router) {}

  setTime(value, part) {
    console.log(value, part)
    this.timerService.time[part] = value;
  }

  onSwipeLeft() {
    if (this.navigation.right) this.router.navigate([this.navigation.right]);
  }

  onSwipeRight() {
    if (this.navigation.left) this.router.navigate([this.navigation.left]);
  }

  onSwipeUp() {
    if (this.navigation.bottom) this.router.navigate([this.navigation.bottom]);
  }

  onSwipeDown() {
    if (this.navigation.top) this.router.navigate([this.navigation.top]);
  }
}
