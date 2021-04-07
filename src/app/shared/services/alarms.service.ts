import { Injectable } from "@angular/core";
import { deepCloneObject } from "@shared/functions/utils";
import { Alarm } from "@shared/models/alarm.model";
import { Subject } from "rxjs";
import { FirebaseService } from "./firebase.service";

@Injectable({
  providedIn: "root",
})
export class AlarmsService {
  alarms: Alarm[];
  alarms$: Subject<Alarm[]>;
  editedAlarm: Alarm;
  editedAlarmId$: Subject<number>;

  constructor(private firebaseService: FirebaseService) {
    this.alarms$ = new Subject();
    this.editedAlarmId$ = new Subject();

    this.fetchAlarmsFromAPI();

    this.editedAlarm = new Alarm();
  }

  saveAlarm(alarm: Alarm, id: number): void {
    this.alarms[id] = deepCloneObject(alarm);
    this.alarms$.next(this.alarms);

    this.editedAlarm = null;
    this.editedAlarmId$.next(null);
  }

  cancelAlarm() {
    this.editedAlarm = null;
    this.editedAlarmId$.next(null);
  }

  setEditedAlarmTo(id: number): void {
    this.editedAlarm = this.alarms[id];
  }

  pushAlarmsToAPI() {
    this.firebaseService.setDeviceData("alarms", this.alarms);
  }

  fetchAlarmsFromAPI() {
    this.firebaseService
      .getDeviceDataList("alarms")
      .subscribe((alarms: Alarm[]) => {
        this.alarms = alarms;
        this.alarms$.next(alarms);
      });
  }
}
