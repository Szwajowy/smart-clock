import { deepCloneObject } from "./utils";

export function increaseTime(timeParam, part, options?) {
  let time = deepCloneObject(timeParam);
  if (
    part !== "hours" &&
    part !== "minutes" &&
    part !== "seconds" &&
    part !== "milliseconds"
  )
    return false;

  switch (part) {
    case "hours":
      if (
        time.hours < (options && options.limitHours ? options.limitHours : 99)
      ) {
        time.hours++;
      } else {
        if (
          !options ||
          !options.infinityScroll ||
          options.infinityScroll === false
        )
          return false;

        time.hours = 0;
      }
      break;
    case "minutes":
      if (time.minutes < 59) {
        time.minutes++;
      } else {
        if (
          !options ||
          !options.infinityScroll ||
          options.infinityScroll === false
        ) {
          if (this.increaseTime(time, "hours") === false) return false;
        }

        time.minutes = 0;
      }
      break;
    case "seconds":
      if (time.seconds < 59) {
        time.seconds++;
      } else {
        if (
          !options ||
          !options.infinityScroll ||
          options.infinityScroll === false
        ) {
          if (this.increaseTime(time, "minutes") === false) return false;
        }

        time.seconds = 0;
      }
      break;
    case "milliseconds":
    default:
      if (time.milliseconds < 99) {
        time.milliseconds++;
      } else {
        if (
          !options ||
          !options.infinityScroll ||
          options.infinityScroll === false
        ) {
          if (this.increaseTime(time, "seconds") === false) return false;
        }

        time.milliseconds = 0;
      }
      break;
  }

  return time;
}

// DECREASE TIME ON TIMER OR STOPWATCH
export function decreaseTime(timeParam, part, options?) {
  let time = deepCloneObject(timeParam);

  if (
    part !== "hours" &&
    part !== "minutes" &&
    part !== "seconds" &&
    part !== "milliseconds"
  )
    return false;

  switch (part) {
    case "hours":
      if (time.hours > 0) {
        time.hours--;
      } else {
        if (
          !options ||
          !options.infinityScroll ||
          options.infinityScroll === false
        )
          return false;

        time.hours = options && options.limitHours ? options.limitHours : 99;
      }
      break;
    case "minutes":
      if (time.minutes > 0) {
        time.minutes--;
      } else {
        if (
          !options ||
          !options.infinityScroll ||
          options.infinityScroll === false
        ) {
          if (this.decreaseTime(time, "hours") === false) return false;
        }

        time.minutes = 59;
      }
      break;
    case "seconds":
      if (time.seconds > 0) {
        time.seconds--;
      } else {
        if (
          !options ||
          !options.infinityScroll ||
          options.infinityScroll === false
        ) {
          if (this.decreaseTime(time, "minutes") === false) return false;
        }

        time.seconds = 59;
      }
      break;
    case "milliseconds":
    default:
      if (time.milliseconds > 0) {
        time.milliseconds--;
      } else {
        if (
          !options ||
          !options.infinityScroll ||
          options.infinityScroll === false
        ) {
          if (this.decreaseTime(time, "seconds") === false) return false;
        }

        time.milliseconds = 99;
      }
      break;
  }

  return time;
}
