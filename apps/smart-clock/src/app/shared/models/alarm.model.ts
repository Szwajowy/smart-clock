import { TimeCounter } from './time-counter.model';

export class Alarm {
  constructor(
   public time: TimeCounter = new TimeCounter(),
   public repeat: [boolean, boolean, boolean, boolean, boolean, boolean, boolean] = [false, false, false, false, false, false, false],
   public active: boolean = false,
   public lastFiring: Date = new Date(),
  ) {}
}