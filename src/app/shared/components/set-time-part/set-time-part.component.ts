import { Component, Input, OnInit } from "@angular/core";
import { decreaseTime, increaseTime } from "@shared/functions/time-utils";

@Component({
  selector: "app-set-time-part",
  templateUrl: "./set-time-part.component.html",
  styleUrls: ["./set-time-part.component.scss"],
})
export class SetTimePartComponent implements OnInit {
  @Input() time: { seconds?: number; minutes?: number; hours?: number };
  @Input() part: "seconds" | "minutes" | "hours";

  constructor() {}

  ngOnInit() {}

  onIncrease() {
    this.time = increaseTime(this.time, this.part);
  }

  onDecrease() {
    this.time = decreaseTime(this.time, this.part);
  }

  getNumberInTwoDigits() {
    if (!this.time || this.time == {}) return "00";
    const number = this.time[this.part];
    if (number < 10) return "0" + number;

    return number;
  }
}
