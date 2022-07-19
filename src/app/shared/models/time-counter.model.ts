import { BehaviorSubject } from "rxjs";

import { Time } from "./time.model";

export class TimeCounter extends Time {
  private _subject = new BehaviorSubject<Time>({
    hours: this.hours,
    minutes: this.minutes,
    seconds: this.seconds,
    milliseconds: this.milliseconds,
  });

  get subject() {
    return this._subject;
  }

  increment(
    part: string,
    options?: { limitHours?: number; infinityScroll?: boolean }
  ): boolean {
    if (
      part !== "hours" &&
      part !== "minutes" &&
      part !== "seconds" &&
      part !== "milliseconds"
    )
      return false;

    switch (part) {
      case "hours":
      case "milliseconds": {
        let limitHours: number;

        // Set variable limiting hours to provided limit or to default
        if (part === "hours" && options && options.limitHours) {
          limitHours = options.limitHours;
        } else {
          limitHours = 99;
        }

        if (this[part] < limitHours) {
          this[part]++;
        } else {
          if (
            (!options || !options.infinityScroll) &&
            part === "milliseconds" &&
            this.increment("seconds") === false
          )
            return false;

          this[part] = 0;
        }
        break;
      }
      case "minutes":
      case "seconds":
        if (this[part] < 59) {
          this[part]++;
        } else {
          if (!options || !options.infinityScroll) {
            if (
              this.increment(part === "minutes" ? "hours" : "minutes") === false
            )
              return false;
          }

          this[part] = 0;
        }
        break;
    }

    this._subject.next({
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      milliseconds: this.milliseconds,
    });
    return true;
  }

  decrement(part: string, options?: { limitHours?; infinityScroll? }) {
    if (
      part !== "hours" &&
      part !== "minutes" &&
      part !== "seconds" &&
      part !== "milliseconds"
    )
      return false;

    switch (part) {
      case "hours":
      case "milliseconds":
        if (this[part] > 0) {
          this[part]--;
        } else {
          if (
            !options ||
            !options.infinityScroll ||
            options.infinityScroll === false
          ) {
            if (part === "milliseconds") {
              if (this.decrement("seconds") === false) return false;
            } else {
              return false;
            }
          }

          this[part] = 99;
        }
        break;
      case "minutes":
      case "seconds":
        if (this[part] > 0) {
          this[part]--;
        } else {
          if (
            !options ||
            !options.infinityScroll ||
            options.infinityScroll === false
          ) {
            if (
              this.decrement(part === "minutes" ? "hours" : "minutes") === false
            )
              return false;
          }

          this[part] = 59;
        }
        break;
    }

    this._subject.next({
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      milliseconds: this.milliseconds,
    });
    return true;
  }

  reset() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;

    this._subject.next({
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      milliseconds: this.milliseconds,
    });
  }

  getHoursText() {
    switch (this.hours) {
      case 1:
        return "godzina";
      case 2:
      case 3:
      case 4:
        return "godziny";
      default:
        return "godzin";
    }
  }
}
