import { Injectable } from "@angular/core";
import { deepCloneObject } from "@shared/functions/utils";
import { Alarm } from "@shared/models/alarm.model";
import { BehaviorSubject, combineLatest, concat, forkJoin, Observable, Subject, Subscription } from "rxjs";
import { FindValueSubscriber } from "rxjs/internal/operators/find";
import { first, take, tap } from "rxjs/operators";
import { FirebaseService } from "./firebase.service";

@Injectable({
  providedIn: "root",
})
export class AlarmsService {
  editedAlarm: Alarm;
  isEditMode: boolean = false;

  alarms$: BehaviorSubject<Alarm[]>;
  editedAlarmId$: BehaviorSubject<number>;

  alarmsSubscription: Subscription;

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
    })

  }

  editAlarm(id: number): void {
    this.alarms$.pipe(first()).subscribe((alarms: Alarm[]) => {
      this.isEditMode = true;
      this.editedAlarm = deepCloneObject(alarms[id]);
      this.editedAlarmId$.next(id);
    });
  }

  removeAlarm(id: number): void {
    this.alarms$.pipe(first()).subscribe((alarms: Alarm[]) => {
      alarms.splice(id,1)
      this.alarms$.next(alarms);

      this.editedAlarm = null;
      this.editedAlarmId$.next(null);

      this.pushAlarmsToDb();
    })
  }

  saveAlarm(alarm: Alarm): void {
    combineLatest(this.alarms$,this.editedAlarmId$).pipe(first()).subscribe(([alarms, id]) => {
      alarms[id] = deepCloneObject(alarm);
      this.alarms$.next(alarms);

      this.editedAlarm = null;
      this.editedAlarmId$.next(null);

      this.pushAlarmsToDb();
    })
  }

  cancelAlarm() {
    this.editedAlarm = null;
    this.editedAlarmId$.next(null);
  }

  toggleActiveStateOfAlarm(id:number) {
    this.alarms$.pipe(first()).subscribe((alarms: Alarm[]) => {
      alarms[id].active = !alarms[id].active;
      this.alarms$.next(alarms);

      this.pushAlarmsToDb();
    })
  }

  pushAlarmsToDb(): void {
    this.alarms$.pipe(first()).subscribe((alarms: Alarm[]) => {
      this.firebaseService.setDeviceData("alarms", alarms);
    })
  }

  fetchAlarmsFromDb(): Observable<Alarm[]> {
    return this.firebaseService.getDeviceDataList('alarms').pipe(tap((alarms: Alarm[]) => {
      this.alarms$.next(alarms);
    }));
  }
}
