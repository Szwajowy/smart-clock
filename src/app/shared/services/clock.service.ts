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

  private alarms = [];
  private alarmsSubject = new Subject<any>();

  private newAlarm = {
    time: {
      hours: 0,
      minutes: 0,
    },
    repeat: {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
    active: false,
    lastFiring: null,
    timeSubject: new Subject<any>(),
    repeatSubject: new Subject<any>(),
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

    if (this.alarms && this.alarms.length > 0) {
      let closeAlarms = [];

      this.alarms.forEach((alarm) => {
        // Check if alarm time is in 3 hours range from now
        if (alarm.active === true) {
          let alarmTime = {
            hour: alarm.time.hours,
            minute: alarm.time.minutes,
          };

          if (
            this.isAlarmBetween(
              alarmTime,
              {
                hour:
                  this.clock.datetime.getUTCHours() +
                  Number(
                    this.settingsService
                      .getSettings()
                      .timezone.offset.slice(0, 3)
                  ),
                minute: this.clock.datetime.getUTCMinutes(),
              },
              {
                hour:
                  this.clock.datetime.getUTCHours() +
                  8 +
                  Number(
                    this.settingsService
                      .getSettings()
                      .timezone.offset.slice(0, 3)
                  ),
                minute: this.clock.datetime.getUTCMinutes(),
              }
            )
          ) {
            closeAlarms.push(moment(alarmTime));
          }
        }

        // Check if alarm is turned on and
        // if alarm fire time is same as now and
        // if it should fire day and
        // it wasnt firing today or wasnt firing at all

        let hourInTimezone =
          this.clock.datetime.getUTCHours() +
          Number(
            this.settingsService.getSettings().timezone.offset.slice(0, 3)
          );
        if (hourInTimezone === 24) hourInTimezone = 0;

        if (
          alarm.active === true &&
          alarm.time.hours === hourInTimezone &&
          alarm.time.minutes === this.clock.datetime.getUTCMinutes() &&
          this.isAlarmToday(alarm) &&
          (!alarm.lastFiring ||
            moment(alarm.lastFiring).isBefore(this.clock.datetime, "minute")) &&
          this.router.url !== "/firingAlarm"
        ) {
          // Set last firing date to today and redirect to alarm screen
          alarm.lastFiring = this.clock.datetime;
          this.router.navigate(["/alarmFiring"]);
        }
      });

      if (closeAlarms.length > 0) {
        let closestAlarm = closeAlarms[0];
        closeAlarms.forEach((alarm) => {
          closestAlarm = alarm.isBefore(closestAlarm) ? alarm : closestAlarm;
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
  }

  increaseTime(objectName, part, options?) {
    if (
      objectName !== "timer" &&
      objectName !== "stopwatch" &&
      objectName !== "newAlarm"
    )
      return false;

    if (
      part !== "hours" &&
      part !== "minutes" &&
      part !== "seconds" &&
      part !== "milliseconds"
    )
      return false;

    switch (part) {
      case "hours":
        if (
          this[objectName].time.hours <
          (options && options.limitHours ? options.limitHours : 99)
        ) {
          this[objectName].time.hours++;
        } else {
          if (
            !options ||
            !options.infinityScroll ||
            options.infinityScroll === false
          )
            return false;

          this[objectName].time.hours = 0;
        }
        break;
      case "minutes":
        if (this[objectName].time.minutes < 59) {
          this[objectName].time.minutes++;
        } else {
          if (
            !options ||
            !options.infinityScroll ||
            options.infinityScroll === false
          ) {
            if (this.increaseTime(objectName, "hours") === false) return false;
          }

          this[objectName].time.minutes = 0;
        }
        break;
      case "seconds":
        if (this[objectName].time.seconds < 59) {
          this[objectName].time.seconds++;
        } else {
          if (
            !options ||
            !options.infinityScroll ||
            options.infinityScroll === false
          ) {
            if (this.increaseTime(objectName, "minutes") === false)
              return false;
          }

          this[objectName].time.seconds = 0;
        }
        break;
      case "milliseconds":
      default:
        if (this[objectName].time.milliseconds < 99) {
          this[objectName].time.milliseconds++;
        } else {
          if (
            !options ||
            !options.infinityScroll ||
            options.infinityScroll === false
          ) {
            if (this.increaseTime(objectName, "seconds") === false)
              return false;
          }

          this[objectName].time.milliseconds = 0;
        }
        break;
    }

    this[objectName].timeSubject.next(this[objectName].time);
    return true;
  }

  // DECREASE TIME ON TIMER OR STOPWATCH
  decreaseTime(objectName, part, options?) {
    if (
      objectName !== "timer" &&
      objectName !== "stopwatch" &&
      objectName !== "newAlarm"
    )
      return false;

    if (
      part !== "hours" &&
      part !== "minutes" &&
      part !== "seconds" &&
      part !== "milliseconds"
    )
      return false;

    switch (part) {
      case "hours":
        if (this[objectName].time.hours > 0) {
          this[objectName].time.hours--;
        } else {
          if (
            !options ||
            !options.infinityScroll ||
            options.infinityScroll === false
          )
            return false;

          this[objectName].time.hours =
            options && options.limitHours ? options.limitHours : 99;
        }
        break;
      case "minutes":
        if (this[objectName].time.minutes > 0) {
          this[objectName].time.minutes--;
        } else {
          if (
            !options ||
            !options.infinityScroll ||
            options.infinityScroll === false
          ) {
            if (this.decreaseTime(objectName, "hours") === false) return false;
          }

          this[objectName].time.minutes = 59;
        }
        break;
      case "seconds":
        if (this[objectName].time.seconds > 0) {
          this[objectName].time.seconds--;
        } else {
          if (
            !options ||
            !options.infinityScroll ||
            options.infinityScroll === false
          ) {
            if (this.decreaseTime(objectName, "minutes") === false)
              return false;
          }

          this[objectName].time.seconds = 59;
        }
        break;
      case "milliseconds":
      default:
        if (this[objectName].time.milliseconds > 0) {
          this[objectName].time.milliseconds--;
        } else {
          if (
            !options ||
            !options.infinityScroll ||
            options.infinityScroll === false
          ) {
            if (this.decreaseTime(objectName, "seconds") === false)
              return false;
          }

          this[objectName].time.milliseconds = 99;
        }
        break;
    }

    this[objectName].timeSubject.next(this[objectName].time);
    return true;
  }

  // HELPING FUNCTIONS
  transformToMinutes(time) {
    return time.minute + time.hour * 60;
  }

  isAlarmToday(alarm) {
    let alarmToday = false;

    // Check for everyday of week
    for (let day in alarm.repeat) {
      // If alarm is set to repeat on this day and this day is today
      if (
        alarm.repeat[day] === true &&
        this.changeDayOfWeekNameToNumber(day) === this.clock.datetime.getDay()
      )
        alarmToday = true;
    }

    return alarmToday;
  }

  isAlarmBetween(alarm, startTime, endTime) {
    const alarmInMinutes = this.transformToMinutes(alarm);
    const startTimeInMinutes = this.transformToMinutes(startTime);
    const endTimeInMinutes = this.transformToMinutes(endTime);

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

  changeDayOfWeekNameToNumber(day) {
    switch (day) {
      case "mon":
        return 0;
      case "tue":
        return 1;
      case "wed":
        return 2;
      case "thu":
        return 3;
      case "fri":
        return 4;
      case "sat":
        return 5;
      case "sun":
        return 6;
    }
  }

  pushAlarmsToAPI() {
    this.firebaseService.setDeviceData("alarms", this.alarms);
  }

  fetchAlarmsFromAPI() {
    this.firebaseService.getDeviceDataList("alarms").subscribe((res) => {
      this.alarms = res;
      this.alarmsSubject.next(this.alarms);
    });
  }

  // ADD NEW ALARM TO ALARMS ARRAY
  addNewAlarm() {
    let repeatIsChanged = false;

    for (let day in this.newAlarm.repeat) {
      if (this.newAlarm.repeat[day] === true) repeatIsChanged = true;
    }

    if (!repeatIsChanged)
      this.newAlarm.repeat = {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true,
      };

    // Using JSON.parse(JSON.stingify()) to deeply clone object
    this.alarms.push(
      JSON.parse(
        JSON.stringify({
          time: this.newAlarm.time,
          repeat: this.newAlarm.repeat,
          active: true,
        })
      )
    );

    this.alarmsSubject.next(this.alarms);

    this.pushAlarmsToAPI();

    this.clearNewAlarm();
  }

  // SET NEW ALARM OBJECT TO DEFAULT
  clearNewAlarm() {
    this.newAlarm.time = {
      hours: 0,
      minutes: 0,
    };

    this.newAlarm.repeat = {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    };

    this.newAlarm.active = false;

    this.newAlarm.timeSubject.next(this.newAlarm.time);
    this.newAlarm.repeatSubject.next(this.newAlarm.repeat);
  }

  toggleAlarmStatus(index) {
    this.alarms[index].active = !this.alarms[index].active;
    this.pushAlarmsToAPI();
  }

  toggleRepeatDay(day) {
    this.newAlarm.repeat[day] = !this.newAlarm.repeat[day];
  }

  isDayAlreadyInRepeat(newDay) {
    return this.newAlarm.repeat[newDay];
  }

  getAlarms() {
    return this.alarms;
  }

  getNewAlarm() {
    return this.newAlarm;
  }

  // SUBJECT FOR NOTIFICATIONS
  getSubject() {
    return this.clockSubject;
  }

  //ALARMS GETTERS
  getAlarmsSubject() {
    return this.alarmsSubject;
  }

  getNewAlarmTimeSubject() {
    return this.newAlarm.timeSubject;
  }

  getNewAlarmRepeatSubject() {
    return this.newAlarm.repeatSubject;
  }

  //CLOCK GETTERS
  getMomentSubject() {
    return this.clock.momentSubject;
  }

  getNow() {
    return this.clock.datetime;
  }
}
