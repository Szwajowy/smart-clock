import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Alarm } from "@shared/models/alarm.model";
import { Timezone } from "@shared/models/timezone.model";
import { SettingsService } from "app/pages/settings/settings.service";
import { NotificationsService } from "app/pages/home/notification-bar/notifications.service";
import * as moment from "moment";
import { BehaviorSubject, Subject } from "rxjs";
import { AdjustingInterval } from "../../shared/models/adjusting-interval.model";
import { AlarmsService } from "../alarms/alarms.service";
import { first } from "rxjs/operators";

const HOURS_TO_CHECK_FOR_ALARM: number = 8;
@Injectable({
  providedIn: "root",
})
export class ClockService {
  private currentDate$: BehaviorSubject<Date> = new BehaviorSubject(new Date());
  private timezone: Timezone;
  private getTimeInterval: AdjustingInterval;

  constructor(
    private router: Router,
    private alarmsService: AlarmsService,
    private notificationsService: NotificationsService,
    private settingsService: SettingsService
  ) {
    this.timezone = this.settingsService.getSettings().timezone;
    this.getTimeInterval = new AdjustingInterval(
      this.getTimeNow.bind(this),
      1000
    );

    this.getTimeInterval.start();
  }

  pad(number: number): string {
    if (number < 10) return "0" + number;

    return number.toString();
  }

  getTimeNow(): void {
    this.currentDate$.next(new Date());

    // CHECK FOR EACH ALARM IF IT IS SET TO THIS TIME
    this.checkForCloseAlarms();
    this.checkForFiringAlarms();
  }

  checkForCloseAlarms(): void {
    let closeAlarms: Alarm[] = [];

    this.alarmsService.alarms$.subscribe((alarms: Alarm[]) => {
      if (!alarms || alarms.length === 0) return false;

      alarms.forEach((alarm) => {
        if (!alarm.active) return false;
        let currentDate: Date;
        this.currentDate$.pipe(first()).subscribe((currentDate: Date) => {
          currentDate = currentDate;
        });
        if (
          this.alarmIsFiringInNextHours(alarm, HOURS_TO_CHECK_FOR_ALARM) &&
          (!alarm.lastFiring ||
            moment(alarm.lastFiring).isBefore(currentDate, "minute"))
        )
          closeAlarms.push(alarm);
      });

      this.sendNotificationAboutClosestAlarm(closeAlarms);
    });
  }

  private alarmIsFiringInNextHours(
    alarm: Alarm,
    hoursToCheck: number
  ): boolean {
    let currentDate: Date;
    this.currentDate$.pipe(first()).subscribe((currentDate: Date) => {
      currentDate = currentDate;
    });
    const startTime = {
      hour:
        currentDate.getUTCHours() + Number(this.timezone.offset.slice(0, 3)),
      minute: currentDate.getUTCMinutes(),
    };
    const endTime = {
      hour:
        currentDate.getUTCHours() +
        hoursToCheck +
        Number(this.timezone.offset.slice(0, 3)),
      minute: currentDate.getUTCMinutes(),
    };

    if (!alarm.repeat.includes(true)) {
      return this.alarmsService.isAlarmBetween(alarm, startTime, endTime);
    }

    if (endTime.hour > 23) {
      let firesToday = false;
      let firesTommorow = false;
      const endOfDay = { hour: 23, minute: 59 };
      const startOfDay = { hour: 0, minute: 0 };

      if (alarm.repeat[currentDate.getDay()]) {
        firesToday = this.alarmsService.isAlarmBetween(
          alarm,
          startTime,
          endOfDay
        );
      }

      if (alarm.repeat[currentDate.getDate()]) {
        firesTommorow = this.alarmsService.isAlarmBetween(
          alarm,
          startOfDay,
          endTime
        );
      }

      return firesToday || firesTommorow;
    } else {
      if (alarm.repeat[currentDate.getDay()])
        return this.alarmsService.isAlarmBetween(alarm, startTime, endTime);
    }
  }

  checkForFiringAlarms() {
    let currentDate: Date;
    this.currentDate$.pipe(first()).subscribe((currentDate: Date) => {
      currentDate = currentDate;
    });
    this.alarmsService.alarms$.subscribe((alarms: Alarm[]) => {
      if (!alarms || alarms.length === 0) return false;

      alarms.forEach((alarm) => {
        if (!alarm.active) return false;

        let hourInTimezone =
          currentDate.getUTCHours() +
          Number(
            this.settingsService.getSettings().timezone.offset.slice(0, 3)
          );
        if (hourInTimezone === 24) hourInTimezone = 0;

        if (
          alarm.time.hours === hourInTimezone &&
          alarm.time.minutes === currentDate.getUTCMinutes() &&
          this.alarmsService.isAlarmToday(alarm, currentDate.getDay()) &&
          (!alarm.lastFiring ||
            moment(alarm.lastFiring).isBefore(currentDate, "minute")) &&
          this.router.url !== "/firingAlarm"
        ) {
          // Set last firing date to today and redirect to alarm screen
          alarm.lastFiring = currentDate;
          if (!alarm.repeat.includes(true)) alarm.active = false;
          this.router.navigate(["/alarmFiring"]);
        }
      });
    });
  }

  private sendNotificationAboutClosestAlarm(closeAlarms: Alarm[]): void {
    if (closeAlarms.length > 0) {
      let closestAlarm = moment({
        hour: closeAlarms[0].time.hours,
        minute: closeAlarms[0].time.minutes,
      });
      closeAlarms.forEach((alarm: Alarm) => {
        const alarmTime = moment({
          hour: alarm.time.hours,
          minute: alarm.time.minutes,
        });
        closestAlarm = alarmTime.isBefore(closestAlarm)
          ? alarmTime
          : closestAlarm;
      });

      this.notificationsService.getInputNotificationsSubject().next({
        type: "alarm",
        operation: "post",
        content:
          "Budzik zadzwoni o " +
          this.pad(closestAlarm.get("hour")) +
          ":" +
          this.pad(closestAlarm.get("minute")),
        icon: "clock",
      });
    } else {
      this.notificationsService.getInputNotificationsSubject().next({
        type: "alarm",
        operation: "remove",
        content: null,
        icon: null,
      });
    }
  }

  getCurrentDate() {
    return this.currentDate$;
  }
}
