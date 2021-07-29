import { Injectable } from "@angular/core";
import { Howl } from "howler";

import { AdjustingInterval } from "../../shared/models/adjusting-interval.model";
import { TimeCounter } from "../../shared/models/time-counter.model";

import { NotificationsService } from "app/pages/home/notification-bar/notifications.service";

@Injectable({
  providedIn: "root",
})
export class TimerService {
  time = new TimeCounter();
  private running = false;
  private paused = false;
  public countedDown = false;

  private interval = new AdjustingInterval(this.countDown.bind(this), 10);

  private timerEndSound = new Howl({
    src: "../../../../assets/audio/alarm-sound.mp3",
    preload: true,
    loop: true,
    volume: 0,
  });

  constructor(private notificationsService: NotificationsService) {}

  countDown() {
    if (!this.paused) {
      if (this.time.decrement("milliseconds") === false) {
        this.countedDown = true;
        this.timerEndSound.play();
        this.timerEndSound.fade(0, 1, 100);
        this.stop();
      }

      // SEND NOTIFICATION
      this.notificationsService.getInputNotificationsSubject().next({
        type: "timer",
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
        type: "timer",
        operation: "post",
        content: "Minutnik został wstrzymany!",
        icon: "timer",
      });
    } else {
      this.paused = false;
    }
  }

  // STOP STOPWATCH OR TIMER
  stop() {
    this.interval.stop();

    this.running = false;
    this.paused = false;

    this.time.reset();

    // SEND NOTIFICATION
    this.notificationsService.getInputNotificationsSubject().next({
      type: "timer",
      operation: "remove",
      content: null,
      icon: null,
    });
  }

  reset() {
    this.stop();
    this.countedDown = false;
    this.timerEndSound.stop();
  }

  isPaused() {
    return this.paused;
  }

  isRunning() {
    return this.running;
  }
}
