import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-alarm",
  templateUrl: "./alarm.component.html",
  styleUrls: ["./alarm.component.scss"]
})
export class AlarmComponent implements OnInit {
  @Input() alarm;
  newAlarm;

  public dayOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  public isModified = false;

  constructor() {}

  ngOnInit() {}

  pad(number) {
    if (number < 10) return "0" + number;

    return number;
  }

  translateNameOfDay(shortName) {
    switch (shortName) {
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

  onModifyAlarm() {
    this.isModified = !this.isModified;
  }

  onIncrease(part) {}

  onDecrease(part) {}

  onToggleActive() {
    this.alarm.active = !this.alarm.active;
  }

  onToggleRepeatDay(day) {
    this.alarm.repeat[day] = !this.alarm.repeat[day];
  }

  onSaveAlarm() {}

  onRemoveAlarm() {}
}
