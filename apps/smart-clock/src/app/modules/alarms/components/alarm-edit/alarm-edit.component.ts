import { Component, OnInit } from "@angular/core";
import { Alarm } from "@shared/models/alarm.model";
import { WEEKDAYS_SHORT } from "@shared/models/daysNames.model";
import { first } from "rxjs/operators";
import { AlarmsService } from "../../alarms.service";

@Component({
  selector: "app-alarm-edit",
  templateUrl: "./alarm-edit.component.html",
  styleUrls: ["./alarm-edit.component.scss"],
})
export class AlarmEditComponent implements OnInit {
  readonly dayOrder = WEEKDAYS_SHORT;

  editedAlarm: Alarm;
  isEditMode = false;

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
      const alarmToRemoveId = id;
      this.alarmsService.removeAlarm(alarmToRemoveId);
    });
  }

  onToggleRepeatDay(dayId) {
    this.editedAlarm.repeat[dayId] = !this.editedAlarm.repeat[dayId];
  }
}
