import { Injectable } from "@angular/core";
import { transformTimeToMinutes } from "@shared/functions/time-utils";
import { cloneObject } from "@shared/functions/utils";
import { Alarm } from "@shared/models/alarm.model";
import { FirebaseService } from "app/core/services/firebase.service";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { first, tap } from "rxjs/operators";

@Injectable()
export class AlarmsService {
  editedAlarm: Alarm;
  isEditMode: boolean = false;

  alarms$: BehaviorSubject<Alarm[]>;
  editedAlarmId$: BehaviorSubject<number>;

  constructor(private firebaseService: FirebaseService) {
    this.alarms$ = new BehaviorSubject([]);
    this.editedAlarmId$ = new BehaviorSubject(null);
    this.editedAlarm = new Alarm();
  }

  createAlarm(): void {
    this.alarms$.pipe(first()).subscribe((alarms: Alarm[]) => {
      let lenghtOfAlarmsArray = alarms.length;

      this.isEditMode = false;
      this.editedAlarm = new Alarm();
      this.editedAlarmId$.next(lenghtOfAlarmsArray);
    });
  }

  editAlarm(id: number): void {
    this.alarms$.pipe(first()).subscribe((alarms: Alarm[]) => {
      this.isEditMode = true;
      this.editedAlarm = cloneObject(alarms[id]);
      this.editedAlarmId$.next(id);
    });
  }

  removeAlarm(id: number): void {
    this.alarms$.pipe(first()).subscribe((alarms: Alarm[]) => {
      alarms.splice(id, 1);
      this.alarms$.next(alarms);

      this.editedAlarm = null;
      this.editedAlarmId$.next(null);

      this.pushAlarmsToDb();
    });
  }

  saveAlarm(alarm: Alarm): void {
    combineLatest(this.alarms$, this.editedAlarmId$)
      .pipe(first())
      .subscribe(([alarms, id]) => {
        alarm.lastFiring = null;
        alarms[id] = cloneObject(alarm);
        this.alarms$.next(alarms);

        this.editedAlarm = null;
        this.editedAlarmId$.next(null);

        this.pushAlarmsToDb();
      });
  }

  cancelAlarm(): void {
    this.editedAlarm = null;
    this.editedAlarmId$.next(null);
  }

  toggleActiveStateOfAlarm(id: number): void {
    this.alarms$.pipe(first()).subscribe((alarms: Alarm[]) => {
      alarms[id].active = !alarms[id].active;
      this.alarms$.next(alarms);

      this.pushAlarmsToDb();
    });
  }

  pushAlarmsToDb(): void {
    this.alarms$.pipe(first()).subscribe((alarms: Alarm[]) => {
      this.firebaseService.setDeviceData("alarms", alarms);
    });
  }

  fetchAlarmsFromDb(): Observable<any> {
    return this.firebaseService.getDeviceDataList("alarms").pipe(
      tap((alarms) => {
        this.alarms$.next(alarms);
      })
    );
  }

  isAlarmBetween(
    alarm: Alarm,
    startTime: { minute: number; hour: number },
    endTime: { minute: number; hour: number }
  ): boolean {
    const alarmInMinutes = transformTimeToMinutes({
      hour: alarm.time.hours,
      minute: alarm.time.minutes,
    });
    const startTimeInMinutes = transformTimeToMinutes(startTime);
    const endTimeInMinutes = transformTimeToMinutes(endTime);

    if (endTimeInMinutes < startTimeInMinutes) {
      if (this.isAlarmBetween(alarm, startTime, { hour: 24, minute: 0 }))
        return true;

      if (this.isAlarmBetween(alarm, { hour: 0, minute: 0 }, endTime))
        return true;
    } else if (
      alarmInMinutes >= startTimeInMinutes &&
      alarmInMinutes <= endTimeInMinutes
    )
      return true;

    return false;
  }

  isAlarmToday(alarm: Alarm, todayDayNumber: number): boolean {
    if (!alarm || !alarm.active) return false;

    if (!alarm.repeat.includes(true) && !alarm.lastFiring) return true;

    return alarm.repeat[todayDayNumber];
  }
}
