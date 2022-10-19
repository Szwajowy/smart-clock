export class Time {
  public hours = 0;
  public minutes = 0;
  public seconds = 0;
  public milliseconds = 0;

  constructor(
    hours?: number,
    minutes?: number,
    seconds?: number,
    miliseconds?: number
  ) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.milliseconds = miliseconds;
  }

  static createCopy(time: Time): Time {
    return new Time(time.hours, time.minutes, time.seconds, time.milliseconds);
  }
}
