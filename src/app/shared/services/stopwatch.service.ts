import { Injectable } from "@angular/core";

import { AdjustingInterval } from "../models/adjusting-interval.model";
import { TimeCounter } from "../models/time-counter.model";
import { NotificationsService } from "@shared/components/notification-bar/notifications.service";

@Injectable({
  providedIn: "root",
})
export class StopwatchService {
  private _time = new TimeCounter();
  private running = false;
  private paused = false;
  private interval = new AdjustingInterval(this.countUp.bind(this), 10);

  get time() {
    return this._time;
  }

  constructor(private notificationsService: NotificationsService) {}

  countUp() {
    if (!this.paused) {
      if (this.time.increment("milliseconds") === false) {
        this.stop();
      }

      // SEND NOTIFICATION
      this.notificationsService.getInputNotificationsSubject().next({
        type: "stopwatch",
        operation: "post",
        content:
          this.pad(this.time.hours) +
          ":" +
          this.pad(this.time.minutes) +
          ":" +
          this.pad(this.time.seconds),
        icon: "stopwatch",
      });
    }
  }

  pad(number) {
    return number > 9 ? number.toString() : "0" + number;
  }

  startPause() {
    if (!this.running) {
      this.running = true;
      this.interval.start();
    } else if (!this.paused) {
      this.paused = true;

      // SEND NOTIFICATION
      this.notificationsService.getInputNotificationsSubject().next({
        type: "stopwatch",
        operation: "post",
        content: "Stoper został wstrzymany!",
        icon: "timer",
      });
    } else {
      this.paused = false;
    }
  }

  // STOP STOPWATCH
  stop() {
    this.interval.stop();

    this.running = false;
    this.paused = false;

    this.time.reset();

    // SEND NOTIFICATION
    this.notificationsService.getInputNotificationsSubject().next({
      type: "stopwatch",
      operation: "remove",
      content: null,
      icon: null,
    });
  }

  isPaused() {
    return this.paused;
  }

  isRunning() {
    return this.running;
  }
}
