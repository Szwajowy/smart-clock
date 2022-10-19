import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

import { AlarmsService } from '../alarms/alarms.service';
import { SettingsService } from '../settings/settings.service';
import { NotificationsService } from './notifications.service';
import { Alarm } from '@shared/models/alarm.model';
import { AdjustingInterval } from '../../shared/models/adjusting-interval.model';
import { Settings } from '@shared/models/settings.model';
import { isBefore, isTimeBefore } from '@shared/functions/time-utils';
import { Time } from '@shared/models/time.model';

const HOURS_TO_CHECK_FOR_ALARM = 8;
@Injectable()
export class ClockService {
  readonly currentDate$: BehaviorSubject<Date> = new BehaviorSubject(
    new Date()
  );
  private getTimeInterval: AdjustingInterval;

  constructor(
    private router: Router,
    private alarmsService: AlarmsService,
    private notificationsService: NotificationsService,
    private settingsService: SettingsService
  ) {
    this.getTimeInterval = new AdjustingInterval(
      this.getTimeNow.bind(this),
      1000
    );

    this.getTimeInterval.start();
  }

  private pad(number: number): string {
    if (number < 10) return '0' + number;

    return number.toString();
  }

  private getTimeNow(): void {
    this.currentDate$.next(new Date());

    // CHECK FOR EACH ALARM IF IT IS SET TO THIS TIME
    this.checkForCloseAlarms();
    this.checkForFiringAlarms();
  }

  private checkForCloseAlarms(): void {
    const closeAlarms: Alarm[] = [];

    this.alarmsService.alarms$.subscribe((alarms: Alarm[]) => {
      if (!alarms || alarms.length === 0) return false;

      alarms.forEach((alarm) => {
        if (!alarm.active) return false;
        this.currentDate$.pipe(first()).subscribe((currentDate: Date) => {
          if (
            this.alarmIsFiringInNextHours(alarm, HOURS_TO_CHECK_FOR_ALARM) &&
            (!alarm.lastFiring ||
              isBefore(alarm.lastFiring, currentDate, 'minute'))
          )
            closeAlarms.push(alarm);
        });
      });

      this.sendNotificationAboutClosestAlarm(closeAlarms);
    });
  }

  private async alarmIsFiringInNextHours(
    alarm: Alarm,
    hoursToCheck: number
  ): Promise<boolean> {
    const currentDate: Date = await this.currentDate$.toPromise();
    const settings: Settings = await this.settingsService.settings$.toPromise();

    const startTime = {
      hour:
        currentDate.getUTCHours() +
        Number(settings.timezone.offset.slice(0, 3)),
      minute: currentDate.getUTCMinutes(),
    };
    const endTime = {
      hour:
        currentDate.getUTCHours() +
        hoursToCheck +
        Number(settings.timezone.offset.slice(0, 3)),
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

  private async checkForFiringAlarms() {
    const currentDate = await this.currentDate$.toPromise();
    const settings = await this.settingsService.settings$.toPromise();

    this.alarmsService.alarms$.subscribe((alarms: Alarm[]) => {
      if (!alarms || alarms.length === 0) return false;

      alarms.forEach((alarm) => {
        if (!alarm.active) return false;

        let hourInTimezone =
          currentDate.getUTCHours() +
          Number(settings.timezone.offset.slice(0, 3));
        if (hourInTimezone === 24) hourInTimezone = 0;

        if (
          alarm.time.hours === hourInTimezone &&
          alarm.time.minutes === currentDate.getUTCMinutes() &&
          this.alarmsService.isAlarmToday(alarm, currentDate.getDay()) &&
          (!alarm.lastFiring ||
            isBefore(alarm.lastFiring, currentDate, 'minute')) &&
          this.router.url !== '/firingAlarm'
        ) {
          // Set last firing date to today and redirect to alarm screen
          alarm.lastFiring = currentDate;
          if (!alarm.repeat.includes(true)) alarm.active = false;
          this.router.navigate(['/alarmFiring']);
        }
      });
    });
  }

  private sendNotificationAboutClosestAlarm(closeAlarms: Alarm[]): void {
    if (closeAlarms.length > 0) {
      let closestAlarmTime = new Time(
        closeAlarms[0].time.hours,
        closeAlarms[0].time.minutes
      );
      closeAlarms.forEach((alarm: Alarm) => {
        const alarmTime = new Time(alarm.time.hours, alarm.time.minutes);
        closestAlarmTime = isTimeBefore(closestAlarmTime, alarmTime)
          ? Time.createCopy(alarmTime)
          : Time.createCopy(closestAlarmTime);
      });

      this.notificationsService.getInputNotificationsSubject().next({
        type: 'alarm',
        operation: 'post',
        content:
          'Budzik zadzwoni o ' +
          this.pad(closestAlarmTime.hours) +
          ':' +
          this.pad(closestAlarmTime.minutes),
        icon: 'clock',
      });
    } else {
      this.notificationsService.getInputNotificationsSubject().next({
        type: 'alarm',
        operation: 'remove',
        content: null,
        icon: null,
      });
    }
  }
}
