import { Time } from '@shared/models/time.model';
import { cloneObject } from './utils';

export function increaseTime(timeParam, part, options?) {
  const time = cloneObject(timeParam);
  if (
    part !== 'hours' &&
    part !== 'minutes' &&
    part !== 'seconds' &&
    part !== 'milliseconds'
  )
    return false;

  switch (part) {
    case 'hours':
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
    case 'minutes':
      if (time.minutes < 59) {
        time.minutes++;
      } else {
        if (
          !options ||
          !options.infinityScroll ||
          options.infinityScroll === false
        ) {
          if (this.increaseTime(time, 'hours') === false) return false;
        }

        time.minutes = 0;
      }
      break;
    case 'seconds':
      if (time.seconds < 59) {
        time.seconds++;
      } else {
        if (
          !options ||
          !options.infinityScroll ||
          options.infinityScroll === false
        ) {
          if (this.increaseTime(time, 'minutes') === false) return false;
        }

        time.seconds = 0;
      }
      break;
    case 'milliseconds':
    default:
      if (time.milliseconds < 99) {
        time.milliseconds++;
      } else {
        if (
          !options ||
          !options.infinityScroll ||
          options.infinityScroll === false
        ) {
          if (this.increaseTime(time, 'seconds') === false) return false;
        }

        time.milliseconds = 0;
      }
      break;
  }

  return time;
}

// DECREASE TIME ON TIMER OR STOPWATCH
export function decreaseTime(timeParam, part, options?) {
  const time = cloneObject(timeParam);

  if (
    part !== 'hours' &&
    part !== 'minutes' &&
    part !== 'seconds' &&
    part !== 'milliseconds'
  )
    return false;

  switch (part) {
    case 'hours':
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
    case 'minutes':
      if (time.minutes > 0) {
        time.minutes--;
      } else {
        if (
          !options ||
          !options.infinityScroll ||
          options.infinityScroll === false
        ) {
          if (this.decreaseTime(time, 'hours') === false) return false;
        }

        time.minutes = 59;
      }
      break;
    case 'seconds':
      if (time.seconds > 0) {
        time.seconds--;
      } else {
        if (
          !options ||
          !options.infinityScroll ||
          options.infinityScroll === false
        ) {
          if (this.decreaseTime(time, 'minutes') === false) return false;
        }

        time.seconds = 59;
      }
      break;
    case 'milliseconds':
    default:
      if (time.milliseconds > 0) {
        time.milliseconds--;
      } else {
        if (
          !options ||
          !options.infinityScroll ||
          options.infinityScroll === false
        ) {
          if (this.decreaseTime(time, 'seconds') === false) return false;
        }

        time.milliseconds = 99;
      }
      break;
  }

  return time;
}

export function transformTimeToMinutes(time: {
  hour: number;
  minute: number;
}): number {
  return time.minute + time.hour * 60;
}

export type TimeUnit =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'miliseconds';

export function removeLowerTimeParts(date: Date, timePart: TimeUnit): Date {
  const modifiedDate = new Date(date);

  if (timePart === 'miliseconds') return modifiedDate;
  modifiedDate.setMilliseconds(0);
  if (timePart === 'second') return modifiedDate;
  modifiedDate.setSeconds(0);
  if (timePart === 'minute') return modifiedDate;
  modifiedDate.setMinutes(0);
  if (timePart === 'hour') return modifiedDate;
  modifiedDate.setHours(0);
  if (timePart === 'day') return modifiedDate;
  modifiedDate.setDate(0);
  if (timePart === 'month') return modifiedDate;
  modifiedDate.setMonth(0);

  return modifiedDate;
}

export function isBefore(
  date: Date,
  futureDate: Date,
  unit: TimeUnit
): boolean {
  const preparedDate = removeLowerTimeParts(date, unit);
  const preparedFutureDate = removeLowerTimeParts(futureDate, unit);

  return preparedDate.getTime() < preparedFutureDate.getTime();
}

export function isBeforeOrEqual(
  date: Date,
  futureDate: Date,
  unit: TimeUnit
): boolean {
  const preparedDate = removeLowerTimeParts(date, unit);
  const preparedFutureDate = removeLowerTimeParts(futureDate, unit);

  return preparedDate.getTime() <= preparedFutureDate.getTime();
}

export function isAfter(date: Date, futureDate: Date, unit: TimeUnit): boolean {
  return !isBeforeOrEqual(date, futureDate, unit);
}

export function isAfterOrEqual(
  date: Date,
  futureDate: Date,
  unit: TimeUnit
): boolean {
  return !isBefore(date, futureDate, unit);
}

export function isTimeBefore(time: Time, futureTime: Time): boolean {
  if (time.hours < futureTime.hours) return true;
  if (time.hours > futureTime.hours) return false;
  if (time.minutes < futureTime.minutes) return true;
  if (time.minutes > futureTime.minutes) return false;
  if (time.seconds < futureTime.seconds) return true;
  if (time.seconds > futureTime.seconds) return false;
  if (time.milliseconds < futureTime.milliseconds) return true;

  return false;
}

export function isTimeBeforeOrEqual(time: Time, futureTime: Time): boolean {
  if (time.hours < futureTime.hours) return true;
  if (time.hours > futureTime.hours) return false;
  if (time.minutes < futureTime.minutes) return true;
  if (time.minutes > futureTime.minutes) return false;
  if (time.seconds < futureTime.seconds) return true;
  if (time.seconds > futureTime.seconds) return false;
  if (time.milliseconds <= futureTime.milliseconds) return true;

  return false;
}

export function isTimeAfter(time: Time, futureTime: Time): boolean {
  return isTimeBeforeOrEqual(time, futureTime);
}

export function isTimeAfterOrEqual(time: Time, futureTime: Time): boolean {
  return isTimeBefore(time, futureTime);
}
