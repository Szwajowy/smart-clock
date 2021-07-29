import { Component, OnInit, Output } from "@angular/core";
import { Alarm } from "@shared/models/alarm.model";
import { ClockService } from "app/pages/home/clock.service";
import { EventEmitter } from "@angular/core";
import { AlarmsService } from "app/pages/alarms/alarms.service";
import { WEEKDAYS_SHORT } from "@shared/types/daysNames.tupple";
import { first } from "rxjs/operators";

@Component({
  selector: "app-alarm-edit",
  templateUrl: "./alarm-edit.component.html",
  styleUrls: ["./alarm-edit.component.scss"],
})
export class AlarmEditComponent implements OnInit {
  readonly dayOrder = WEEKDAYS_SHORT;

  editedAlarm: Alarm;
  isEditMode: boolean = false;

  constructor(private alarmsService: AlarmsService) {}

  ngOnInit() {
    this.editedAlarm = this.alarmsService.editedAlarm;
    this.isEditMode = this.alarmsService.isEditMode;
  }

  onSaveChanges() {
    this.alarmsService.saveAlarm(this.editedAlarm);
  }

  onCancelChanges() {
    this.alarmsService.cancelAlarm();
  }

  onRemoveAlarm() {
    this.alarmsService.editedAlarmId$.pipe(first()).subscribe((id: number) => {
      let alarmToRemoveId = id;
      this.alarmsService.removeAlarm(alarmToRemoveId);
    });
  }

  onToggleRepeatDay(dayId) {
    this.editedAlarm.repeat[dayId] = !this.editedAlarm.repeat[dayId];
  }
}
