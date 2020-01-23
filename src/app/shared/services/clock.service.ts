import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AngularFireDatabase } from '@angular/fire/database';
import * as moment from 'moment';

import { AdjustingIntervalService } from './ajustingInterval.service';
import { NotificationsService } from 'app/shared/components/notification-bar/notifications.service';
@Injectable({
  providedIn: 'root'
})
export class ClockService {

  private clock = {
    datetime: null,
    interval: null,
    momentSubject: new Subject<any>(),
  }

  private stopwatch = {
    running: false,
    paused: false,
    interval: null,
    time: {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    },
    timeSubject: new Subject<any>(),
  }

  private timer = {
    running: false,
    paused: false,
    interval: null,
    time: {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    },
    timeSubject: new Subject<any>(),
  }

  private alarms = [];
  private alarmsSubject = new Subject<any>();

  private newAlarm = {
    time: {
      hours: 0,
      minutes: 0
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
  }

  private clockSubject = new Subject<any>();

  private url: Observable<string>;

  constructor(private db: AngularFireDatabase, private http: HttpClient, private router: Router, private notificationsService: NotificationsService) {
    this.clock.interval = new AdjustingIntervalService(this.getTimeNow.bind(this), 1000);
    this.stopwatch.interval = new AdjustingIntervalService(this.doStopwatch.bind(this), 10);
    this.timer.interval = new AdjustingIntervalService(this.doTimer.bind(this), 10);

    this.clock.interval.start();
  }

  pad(number) {
    if(number < 10)
      return '0' + number;

    return number;
  }

  // MAIN FUNCTIONS FOR CLOCK, STOPWATCH AND TIMER
  getTimeNow() {
    this.clock.datetime = moment().utc();
    this.clock.datetime.add(1, 'h'); // Change amount of added hours to variable
    this.clock.momentSubject.next(this.clock.datetime);

    // CHECK FOR EACH ALARM IF IT IS SET TO THIS TIME

    if(this.alarms && this.alarms.length > 0) {
      let closeAlarms = [];

      this.alarms.forEach(alarm => {
        // Check if alarm time is in 3 hours range from now
        if(alarm.active === true) {
          let minutesOfDay = function(m){
            return m.minute + m.hour * 60;
          }

          let alarmTime = { hour: alarm.time.hours, minute: alarm.time.minutes };
          
          if(minutesOfDay(alarmTime) >= minutesOfDay({ hour: this.clock.datetime.clone().hours(), minute: this.clock.datetime.clone().minutes() + 1 }) &&
            minutesOfDay(alarmTime) <= minutesOfDay({ hour: this.clock.datetime.clone().hours() + 8, minute: this.clock.datetime.clone().minutes() })
             // Weird bug and datetime is +1 hour so i substract it
          ) {
            closeAlarms.push(moment(alarmTime));
          }
        }
  
        // Check if alarm is turned on and 
        // if alarm fire time is same as now and
        // if it should fire day and
        // it wasnt firing today or wasnt firing at all
        if(alarm.active === true && 
          alarm.time.hours === this.clock.datetime.get('hour') && 
          alarm.time.minutes === this.clock.datetime.get('minute') &&
          this.isAlarmToday(alarm) &&
          (!alarm.lastFiring || 
          alarm.lastFiring.isBefore(this.clock.datetime.clone().subtract(1, 'm'), 'minute')) &&
          this.router.url !== '/firingAlarm') {
            // Set last firing date to today and redirect to alarm screen
            alarm.lastFiring = this.clock.datetime;
            this.router.navigate(['/alarmFiring']);
        }
      });

      if(closeAlarms.length > 0) {
        let closestAlarm = closeAlarms[0];
        closeAlarms.forEach(alarm => {
          closestAlarm = alarm.isBefore(closestAlarm) ? alarm : closestAlarm;
        })

        this.notificationsService.getInputNotificationsSubject().next({
          type: 'alarm',
          operation: 'post',
          content: 'Budzik zadzwoni o ' + this.pad(closestAlarm.get('hour')) + ':' + this.pad(closestAlarm.get('minute')),
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

  doStopwatch() {
    if(!this.stopwatch.paused) {
      if(this.increaseTime('stopwatch','milliseconds') === false) {
        this.stop('stopwatch');
      }

      this.notificationsService.getInputNotificationsSubject().next({
        type: 'stopwatch',
        operation: 'post',
        content: this.pad(this.stopwatch.time.hours) + ':' + 
                 this.pad(this.stopwatch.time.minutes) + ':' + 
                 this.pad(this.stopwatch.time.seconds),
        icon: 'stopwatch',
      });
    }
  }

  doTimer() {
    if(!this.timer.paused) {
      if(this.decreaseTime('timer','milliseconds') === false) {
        this.stop('timer');
      }

      this.notificationsService.getInputNotificationsSubject().next({
        type: 'timer',
        operation: 'post',
        content: this.pad(this.timer.time.hours) + ':' + 
                 this.pad(this.timer.time.minutes) + ':' + 
                 this.pad(this.timer.time.seconds),
        icon: 'stopwatch',
      });
    }
  }

  // HELPING FUNCTIONS
  isAlarmToday(alarm) {
    let alarmToday = false;

    // Check for everyday of week
    for(let day in alarm.repeat) {
      // If alarm is set to repeat on this day and this day is today
      if(alarm.repeat[day] === true && 
        this.changeDayOfWeekNameToNumber(day) === this.clock.datetime.day())
        alarmToday = true;
    }

    return alarmToday;
  }

  changeDayOfWeekNameToNumber(day) {
    switch(day) {
      case 'mon':
        return 0;
      case 'tue':
        return 1;
      case 'wed':
        return 2;
      case 'thu':
        return 3;
      case 'fri':
        return 4;
      case 'sat':
        return 5;
      case 'sun':
        return 6;
    }
  }

  // START PAUSE STOPWATCH OR TIMER
  startPause(objectName) {
    if(objectName !== 'timer' && objectName !=='stopwatch')
      return false;

    if(!this.isRunning(objectName)) {
      this[objectName].running = true;
      this[objectName].interval.start();
    } else if(!this[objectName].paused) {
      this[objectName].paused = true;
      
      this.notificationsService.getInputNotificationsSubject().next({
        type: objectName,
        operation: 'post',
        content: objectName === 'timer' ? 'Minutnik został wstrzymany!' : 'Stoper został wstrzymany!',
        icon: 'stopwatch',
      });
    } else {
      this[objectName].paused = false;
    }
  }

  // STOP STOPWATCH OR TIMER
  stop(objectName) {
    if(objectName !== 'timer' && objectName !=='stopwatch')
      return false;

    this[objectName].interval.stop();

    this[objectName].running = false;
    this[objectName].paused = false;
    
    this[objectName].time = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    }

    this[objectName].timeSubject.next(this[objectName].time);

    this.notificationsService.getInputNotificationsSubject().next({
      type: objectName,
      operation: 'remove',
      content: null,
      icon: null,
    });
  }

  // INCREASE TIME ON TIMER OR STOPWATCH
  increaseTime(objectName, part, options?) {
    if(objectName !== 'timer' && objectName !=='stopwatch' && objectName !== 'newAlarm')
      return false;

    if(part !== 'hours' && part !== 'minutes' && part !== 'seconds' && part !== 'milliseconds')
      return false;

    switch(part) {
      case 'hours':
        if(this[objectName].time.hours < ((options && options.limitHours) ? options.limitHours : 99)) {
          this[objectName].time.hours++;
        } else {
          if(!options || !options.infinityScroll || options.infinityScroll === false) 
            return false;
            
          this[objectName].time.hours = 0;
        }
        break;
      case 'minutes':
        if(this[objectName].time.minutes < 59) {
          this[objectName].time.minutes++;
        } else {
          if(!options || !options.infinityScroll || options.infinityScroll === false) {
            if(this.increaseTime(objectName, 'hours') === false)
              return false;
          }

          this[objectName].time.minutes = 0;
        }
        break;
      case 'seconds':
        if(this[objectName].time.seconds < 59) {
          this[objectName].time.seconds++;
        } else {
          if(!options || !options.infinityScroll || options.infinityScroll === false) {
            if(this.increaseTime(objectName, 'minutes') === false)
              return false;
          }

          this[objectName].time.seconds = 0;
        }
        break;
      case 'milliseconds':
      default:
        if(this[objectName].time.milliseconds < 99) {
          this[objectName].time.milliseconds++;
        } else {
          if(!options || !options.infinityScroll || options.infinityScroll === false) {
            if(this.increaseTime(objectName, 'seconds') === false)
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
    if(objectName !== 'timer' && objectName !=='stopwatch' && objectName !== 'newAlarm')
      return false;

    if(part !== 'hours' && part !== 'minutes' && part !== 'seconds' && part !== 'milliseconds')
      return false;

    switch(part) {
      case 'hours':
        if(this[objectName].time.hours > 0) {
          this[objectName].time.hours--;
        } else {
          if(!options || !options.infinityScroll || options.infinityScroll === false) 
            return false;
            
          this[objectName].time.hours = (options && options.limitHours) ? options.limitHours : 99;
        }
        break;
      case 'minutes':
        if(this[objectName].time.minutes > 0) {
          this[objectName].time.minutes--;
        } else {
          if(!options || !options.infinityScroll || options.infinityScroll === false) {
            if(this.decreaseTime(objectName, 'hours') === false)
              return false;
          }

          this[objectName].time.minutes = 59;
        }
        break;
      case 'seconds':
        if(this[objectName].time.seconds > 0) {
          this[objectName].time.seconds--;
        } else {
          if(!options || !options.infinityScroll || options.infinityScroll === false) {
            if(this.decreaseTime(objectName, 'minutes') === false)
              return false;
          }

          this[objectName].time.seconds = 59;
        }
        break;
      case 'milliseconds':
      default:
        if(this[objectName].time.milliseconds > 0) {
          this[objectName].time.milliseconds--;
        } else {
          if(!options || !options.infinityScroll || options.infinityScroll === false) {
            if(this.decreaseTime(objectName, 'seconds') === false)
              return false; 
          }

          this[objectName].time.milliseconds = 99;
        }
        break;
    }

    this[objectName].timeSubject.next(this[objectName].time);
    return true;
  }

  pushAlarmsToAPI() {
    this.db.object('alarms').set(this.alarms);
  }

  fetchAlarmsFromAPI() {
    this.db.list('alarms').valueChanges().subscribe(res => {
      this.alarms = res;
      this.alarmsSubject.next(this.alarms);
    });
  }

  // ADD NEW ALARM TO ALARMS ARRAY
  addNewAlarm() {
    let repeatIsChanged = false;

    for(let day in this.newAlarm.repeat) {
      if(this.newAlarm.repeat[day] === true)
        repeatIsChanged = true;
    }

    if(!repeatIsChanged)
      this.newAlarm.repeat = {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true,
      }
      
    // Using JSON.parse(JSON.stingify()) to deeply clone object
    this.alarms.push(
      JSON.parse(
        JSON.stringify({
          time: this.newAlarm.time,
          repeat: this.newAlarm.repeat,
          active: true
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
        minutes: 0
      };

    this.newAlarm.repeat = {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
      }

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

  isRunning(objectName) {
    return this[objectName].running;
  }

  isPaused(objectName) {
    return this[objectName].paused;
  }

  getTime(objectName) {
    return this[objectName].time;
  }

  // SUBJECT FOR NOTIFICATIONS
  getSubject() {
    return this.clockSubject;
  }

  getTimeSubject(objectName) {
    return this[objectName].timeSubject;
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
