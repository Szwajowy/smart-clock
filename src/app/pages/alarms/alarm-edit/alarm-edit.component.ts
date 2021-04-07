import { Component, OnInit, Output } from "@angular/core";
import { Alarm } from "@shared/models/alarm.model";
import { ClockService } from "@shared/services/clock.service";
import { EventEmitter } from "@angular/core";
import { AlarmsService } from "@shared/services/alarms.service";
import { WEEKDAYS_SHORT } from "@shared/types/daysNames.tupple";

@Component({
  selector: "app-alarm-edit",
  templateUrl: "./alarm-edit.component.html",
  styleUrls: ["./alarm-edit.component.scss"],
})
export class AlarmEditComponent implements OnInit {
  @Output() closeEditing: EventEmitter<boolean> = new EventEmitter();

  alarm: Alarm;
  dayOrder: string[];

  constructor(private alarmsService: AlarmsService) {}

  ngOnInit() {
    this.dayOrder = WEEKDAYS_SHORT;
    this.alarm = this.alarmsService.editedAlarm;
  }

  // NEW ALARM FUNCTIONS
  onCreateAlarm() {}

  onCancel() {
    this.alarmsService.saveAlarm(null, null);
  }

  onToggleDay(dayId) {
    this.alarm.repeat[dayId] = !this.alarm.repeat[dayId];
    console.log(this.alarm);
  }

  onAlarmToggleStatus(index) {}
}
