import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, Observable } from "rxjs";

import * as moment from "moment";

import { AdjustingInterval } from "../models/adjusting-interval.model";
import { NotificationsService } from "app/shared/components/notification-bar/notifications.service";
import { FirebaseService } from "./firebase.service";
import { SettingsService } from "app/pages/settings/settings.service";

@Injectable({
  providedIn: "root",
})
export class ClockService {
  private clock = {
    datetime: new Date(new Date().getTime()),
    interval: null,
    momentSubject: new Subject<any>(),
  };

  private clockSubject = new Subject<any>();

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private notificationsService: NotificationsService,
    private settingsService: SettingsService
  ) {
    this.clock.interval = new AdjustingInterval(
      this.getTimeNow.bind(this),
      1000
    );

    this.clock.interval.start();
  }

  pad(number) {
    if (number < 10) return "0" + number;

    return number;
  }

  // MAIN FUNCTIONS FOR CLOCK, STOPWATCH AND TIMER
  getTimeNow() {
    this.clock.datetime = new Date(new Date().getTime());
    this.clock.momentSubject.next(this.clock.datetime);

    // CHECK FOR EACH ALARM IF IT IS SET TO THIS TIME

    // if (this.alarms && this.alarms.length > 0) {
    //   let closeAlarms = [];

    //   this.alarms.forEach((alarm) => {
    //     // Check if alarm time is in 3 hours range from now
    //     if (alarm.active === true) {
    //       let alarmTime = {
    //         hour: alarm.time.hours,
    //         minute: alarm.time.minutes,
    //       };

    //       if (
    //         this.isAlarmBetween(
    //           alarmTime,
    //           {
    //             hour:
    //               this.clock.datetime.getUTCHours() +
    //               Number(
    //                 this.settingsService
    //                   .getSettings()
    //                   .timezone.offset.slice(0, 3)
    //               ),
    //             minute: this.clock.datetime.getUTCMinutes(),
    //           },
    //           {
    //             hour:
    //               this.clock.datetime.getUTCHours() +
    //               8 +
    //               Number(
    //                 this.settingsService
    //                   .getSettings()
    //                   .timezone.offset.slice(0, 3)
    //               ),
    //             minute: this.clock.datetime.getUTCMinutes(),
    //           }
    //         )
    //       ) {
    //         closeAlarms.push(moment(alarmTime));
    //       }
    //     }

    // Check if alarm is turned on and
    // if alarm fire time is same as now and
    // if it should fire day and
    // it wasnt firing today or wasnt firing at all

    let hourInTimezone =
      this.clock.datetime.getUTCHours() +
      Number(this.settingsService.getSettings().timezone.offset.slice(0, 3));
    if (hourInTimezone === 24) hourInTimezone = 0;

    //   if (
    //     alarm.active === true &&
    //     alarm.time.hours === hourInTimezone &&
    //     alarm.time.minutes === this.clock.datetime.getUTCMinutes() &&
    //     this.isAlarmToday(alarm) &&
    //     (!alarm.lastFiring ||
    //       moment(alarm.lastFiring).isBefore(this.clock.datetime, "minute")) &&
    //     this.router.url !== "/firingAlarm"
    //   ) {
    //     // Set last firing date to today and redirect to alarm screen
    //     alarm.lastFiring = this.clock.datetime;
    //     this.router.navigate(["/alarmFiring"]);
    //   }
    // });

    //   if (closeAlarms.length > 0) {
    //     let closestAlarm = closeAlarms[0];
    //     closeAlarms.forEach((alarm) => {
    //       closestAlarm = alarm.isBefore(closestAlarm) ? alarm : closestAlarm;
    //     });

    //     this.notificationsService.getInputNotificationsSubject().next({
    //       type: "alarm",
    //       operation: "post",
    //       content:
    //         "Budzik zadzwoni o " +
    //         this.pad(closestAlarm.get("hour")) +
    //         ":" +
    //         this.pad(closestAlarm.get("minute")),
    //       icon: "clock",
    //     });
    //   } else {
    //     this.notificationsService.getInputNotificationsSubject().next({
    //       type: "alarm",
    //       operation: "remove",
    //       content: null,
    //       icon: null,
    //     });
    //   }
    // }
  }

  // HELPING FUNCTIONS
  transformToMinutes(time) {
    return time.minute + time.hour * 60;
  }

  // isAlarmToday(alarm) {
  //   let alarmToday = false;

  //   // Check for everyday of week
  //   for (let day in alarm.repeat) {
  //     // If alarm is set to repeat on this day and this day is today
  //     if (
  //       alarm.repeat[day] === true &&
  //       this.changeDayOfWeekNameToNumber(day) === this.clock.datetime.getDay()
  //     )
  //       alarmToday = true;
  //   }

  //   return alarmToday;
  // }

  // isAlarmBetween(alarm, startTime, endTime) {
  //   const alarmInMinutes = this.transformToMinutes(alarm);
  //   const startTimeInMinutes = this.transformToMinutes(startTime);
  //   const endTimeInMinutes = this.transformToMinutes(endTime);

  //   if (endTimeInMinutes < startTimeInMinutes) {
  //     if (this.isAlarmBetween(alarm, startTime, { hour: 24, minute: 0 }))
  //       return true;

  //     if (this.isAlarmBetween(alarm, { hour: 0, minute: 0 }, endTime))
  //       return true;
  //   } else if (
  //     alarmInMinutes >= startTimeInMinutes &&
  //     alarmInMinutes <= endTimeInMinutes
  //   )
  //     return true;

  //   return false;
  // }

  // changeDayOfWeekNameToNumber(day) {
  //   switch (day) {
  //     case "mon":
  //       return 0;
  //     case "tue":
  //       return 1;
  //     case "wed":
  //       return 2;
  //     case "thu":
  //       return 3;
  //     case "fri":
  //       return 4;
  //     case "sat":
  //       return 5;
  //     case "sun":
  //       return 6;
  //   }
  // }

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
