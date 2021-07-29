import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Alarm } from "@shared/models/alarm.model";
import { Timezone } from "@shared/models/timezone.model";
import { SettingsService } from "app/pages/settings/settings.service";
import { NotificationsService } from "app/pages/home/notification-bar/notifications.service";
import * as moment from "moment";
import { Subject } from "rxjs";
import { AdjustingInterval } from "../../shared/models/adjusting-interval.model";
import { AlarmsService } from "../alarms/alarms.service";

@Injectable({
  providedIn: "root",
})
export class ClockService {
  private clock = {
    datetime: new Date(),
    interval: null,
    momentSubject: new Subject<any>(),
  };

  private clockSubject = new Subject<any>();
  private timezone: Timezone;

  constructor(
    private router: Router,
    private alarmsService: AlarmsService,
    private notificationsService: NotificationsService,
    private settingsService: SettingsService
  ) {
    this.timezone = this.settingsService.getSettings().timezone;
    this.clock.interval = new AdjustingInterval(
      this.getTimeNow.bind(this),
      1000
    );

    this.clock.interval.start();
  }

  pad(number: number): string {
    if (number < 10) return "0" + number;

    return number.toString();
  }

  getTimeNow(): void {
    this.clock.datetime = new Date();
    this.clock.momentSubject.next(this.clock.datetime);

    // CHECK FOR EACH ALARM IF IT IS SET TO THIS TIME
    this.checkForCloseAlarms();
    this.checkForFiringAlarms();
  }

  checkForCloseAlarms(): void {
    const hoursToCheck = 8;
    let closeAlarms: Alarm[] = [];

    this.alarmsService.alarms$.subscribe((alarms: Alarm[]) => {
      if (!alarms || alarms.length === 0) return false;

      alarms.forEach((alarm) => {
        if (!alarm.active) return false;
        if (
          this.alarmIsFiringInNextHours(alarm, hoursToCheck) &&
          (!alarm.lastFiring ||
            moment(alarm.lastFiring).isBefore(this.clock.datetime, "minute"))
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
    const startTime = {
      hour:
        this.clock.datetime.getUTCHours() +
        Number(this.timezone.offset.slice(0, 3)),
      minute: this.clock.datetime.getUTCMinutes(),
    };
    const endTime = {
      hour:
        this.clock.datetime.getUTCHours() +
        hoursToCheck +
        Number(this.timezone.offset.slice(0, 3)),
      minute: this.clock.datetime.getUTCMinutes(),
    };

    if (!alarm.repeat.includes(true)) {
      return this.alarmsService.isAlarmBetween(alarm, startTime, endTime);
    }

    if (endTime.hour > 23) {
      let firesToday = false;
      let firesTommorow = false;
      const endOfDay = { hour: 23, minute: 59 };
      const startOfDay = { hour: 0, minute: 0 };

      if (alarm.repeat[this.clock.datetime.getDay()]) {
        firesToday = this.alarmsService.isAlarmBetween(
          alarm,
          startTime,
          endOfDay
        );
      }

      if (alarm.repeat[this.clock.datetime.getDate()]) {
        firesTommorow = this.alarmsService.isAlarmBetween(
          alarm,
          startOfDay,
          endTime
        );
      }

      return firesToday || firesTommorow;
    } else {
      if (alarm.repeat[this.clock.datetime.getDay()])
        return this.alarmsService.isAlarmBetween(alarm, startTime, endTime);
    }
  }

  checkForFiringAlarms() {
    this.alarmsService.alarms$.subscribe((alarms: Alarm[]) => {
      if (!alarms || alarms.length === 0) return false;

      alarms.forEach((alarm) => {
        if (!alarm.active) return false;

        let hourInTimezone =
          this.clock.datetime.getUTCHours() +
          Number(
            this.settingsService.getSettings().timezone.offset.slice(0, 3)
          );
        if (hourInTimezone === 24) hourInTimezone = 0;

        if (
          alarm.time.hours === hourInTimezone &&
          alarm.time.minutes === this.clock.datetime.getUTCMinutes() &&
          this.alarmsService.isAlarmToday(
            alarm,
            this.clock.datetime.getDay()
          ) &&
          (!alarm.lastFiring ||
            moment(alarm.lastFiring).isBefore(this.clock.datetime, "minute")) &&
          this.router.url !== "/firingAlarm"
        ) {
          // Set last firing date to today and redirect to alarm screen
          alarm.lastFiring = this.clock.datetime;
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

  // SUBJECT FOR NOTIFICATIONS
  getSubject() {
    return this.clockSubject;
  }

  //CLOCK GETTERS
  getMomentSubject() {
    return this.clock.momentSubject;
  }

  getNow() {
    return this.clock.datetime;
  }
}
