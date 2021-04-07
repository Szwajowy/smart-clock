import { Component, Input, OnInit } from "@angular/core";
import { Alarm } from "@shared/models/alarm.model";

@Component({
  selector: "app-alarm",
  templateUrl: "./alarm.component.html",
  styleUrls: ["./alarm.component.scss"],
})
export class AlarmComponent implements OnInit {
  @Input("alarm") alarm: Alarm;

  constructor() {}

  ngOnInit() {}

  onEditAlarm() {}

  getTime(part) {
    return this.alarm.time[part] < 10
      ? "0" + this.alarm.time[part]
      : this.alarm.time[part].toString();
  }

  getRepeatDays() {
    let stringResult = "";

    for (const key in this.alarm.repeat) {
      if (this.alarm.repeat[key] === true)
        stringResult += this.getDayNameShort(key) + ", ";
    }

    return stringResult.slice(0, -2);
  }

  private getDayNameShort(day) {
    switch (day) {
      case "mon":
        return "pon";
      case "tue":
        return "wt";
      case "wed":
        return "śr";
      case "thu":
        return "czw";
      case "fri":
        return "pt";
      case "sat":
        return "sob";
      case "sun":
        return "nd";
    }
  }
}
