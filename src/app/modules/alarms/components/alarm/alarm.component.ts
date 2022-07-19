import { Component, Input } from "@angular/core";
import { Alarm } from "@shared/models/alarm.model";
import { AlarmsService } from "../../alarms.service";

@Component({
  selector: "app-alarm",
  templateUrl: "./alarm.component.html",
  styleUrls: ["./alarm.component.scss"],
})
export class AlarmComponent {
  @Input() alarm: Alarm;
  @Input() id: number;

  constructor(private alarmsService: AlarmsService) {}

  onEditAlarm() {
    this.alarmsService.editAlarm(this.id);
  }

  onToggleActiveState() {
    this.alarmsService.toggleActiveStateOfAlarm(this.id);
  }

  getTime(part) {
    return this.alarm.time[part] < 10
      ? "0" + this.alarm.time[part]
      : this.alarm.time[part].toString();
  }

  getRepeatDays() {
    let stringResult = "";

    for (const key in this.alarm.repeat) {
      if (this.alarm.repeat[key] === true) {
        stringResult += this.getDayNameShort(key) + ", ";
      }
    }

    return stringResult.slice(0, -2);
  }

  private getDayNameShort(day) {
    switch (day) {
      case "0":
        return "pon";
      case "1":
        return "wt";
      case "2":
        return "śr";
      case "3":
        return "czw";
      case "4":
        return "pt";
      case "5":
        return "sob";
      case "6":
        return "nd";
    }
  }
}
