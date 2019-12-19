import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';

import { AdjustingIntervalService } from './ajustingInterval.service';

@Injectable({
  providedIn: 'root'
})
export class ClockService {

  private clock = {
    interval: null,
    time: {
      hours: 0,
      minutes: 0,
      seconds: 0
    },
    date: {
      day: 0,
      dayOfWeek: 0,
      month: 0,
      year: 0,
    },
    momentSubject: new Subject<any>(),
    timeSubject: new Subject<any>(),
    dateSubject: new Subject<any>(),
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

  private alarms = [
    {
      time: {
        hours: 7,
        minutes: 0
      },
      repeat: {
        mon: true,
        tue: false,
        wed: true,
        thu: false,
        fri: true,
        sat: false,
        sun: false,
      },
      active: false
    },
    {
      time: {
        hours: 8,
        minutes: 0
      },
      repeat: {
        mon: false,
        tue: true,
        wed: false,
        thu: true,
        fri: false,
        sat: false,
        sun: false,
      },
      active: true
    },
    {
      time: {
        hours: 9,
        minutes: 0
      },
      repeat: {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: true,
        sun: true,
      },
      active: false
    }
  ];

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
    timeSubject: new Subject<any>(),
    repeatSubject: new Subject<any>(),
  }

  private now;

  private clockSubject = new Subject<any>();

  constructor() {
    this.clock.interval = new AdjustingIntervalService(this.getTimeNow.bind(this), 1000);
    this.stopwatch.interval = new AdjustingIntervalService(this.countup.bind(this), 10);
    this.timer.interval = new AdjustingIntervalService(this.countdown.bind(this), 10);

    this.clock.interval.start();
  }

  getTimeNow() {
    this.now = moment().add(1, 'h');

    this.clock.time = {
      hours: this.now.hours(),
      minutes: this.now.minutes(),
      seconds: this.now.seconds(),
    }

    this.clock.date = {
      day: this.now.day(),
      dayOfWeek: this.now.weekday(),
      month: this.now.month(),
      year: this.now.year(),
    }

    this.clock.momentSubject.next(this.now);
    this.clock.timeSubject.next(this.clock.time);
    this.clock.dateSubject.next(this.clock.date);

    // CHECK IF ALARM IS SET TO THIS TIME
    this.alarms.forEach(alarm => {
      // Check if alarm time is in 3 hours range from now
      if(alarm.active === true) {
        if(this.differenceInTime(alarm.time, this.clock.time) <= 3*60 && this.differenceInTime(alarm.time, this.clock.time) > 0) {
          console.log('Fire a notification', alarm.time);
        }
        if(this.differenceInTime(alarm.time, this.clock.time) >= -(24*60) && this.differenceInTime(alarm.time, this.clock.time) < -(21*60)) {
          console.log('Fire a notification', alarm.time);
        }
      }

      // Check is it time to fire alarm
      if(alarm.active === true && alarm.time.hours === this.clock.time.hours && alarm.time.minutes === this.clock.time.minutes) {
        let alarmToday = false;
        for(let day in alarm.repeat) {
          if(alarm.repeat[day] === true && this.changeDayOfWeekNameToNumber(day) === this.clock.date.dayOfWeek)
            alarmToday = true;
        }

        if(alarmToday)
          console.log('Alarm!');
          // Redirect to alarm screen
      }
    });
  }

  differenceInTime(time1, time2) {
    let difference = {
      hours: 0,
      minutes: 0,
    }
    
    if(time1.minutes - time2.minutes < 0) {
      difference.minutes = 60 + (time1.minutes - time2.minutes);
      difference.hours = time1.hours - time2.hours - 1;
    } else {
      difference.minutes = time1.minutes - time2.minutes;
      difference.hours = time1.hours - time2.hours;
    }

    return difference.hours*60+difference.minutes;
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

  countup() {
    if(!this.stopwatch.paused) {
      if(this.increaseTime('stopwatch','milliseconds') === false) {
        this.stop('stopwatch');
      }
    }
  }

  countdown() {
    if(!this.timer.paused) {
      if(this.decreaseTime('timer','milliseconds') === false) {
        this.stop('timer');
      }
    }
  }

  startPause(objectName) {
    if(!this.isRunning(objectName)) {
      this[objectName].running = true;
      this[objectName].interval.start();

      this.clockSubject.next({
        event: 'start',
        type: objectName,
      });
    } else if(!this[objectName].paused) {
      this[objectName].paused = true;
      
      this.clockSubject.next({
        event: 'paused',
        type: objectName,
      });
    } else {
      this[objectName].paused = false;
      
      this.clockSubject.next({
        event: 'unpaused',
        type: objectName,
      });
    }
  }

  stop(objectName) {
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
    this.clockSubject.next({
      event: 'stoped',
      type: objectName,
    });
  }

  increaseTime(objectName, part, options?) {
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

  decreaseTime(objectName, part, options?) {
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

    this.clearNewAlarm();
  }

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

  getRepeatDays(index) {
    let stringResult = '';
    let i = 0;

    for(const key in this.alarms[index].repeat) {
      if(this.alarms[index].repeat[key] === true)
        stringResult += this.getDayNameShort(key) + ', ';
    };

    return stringResult.slice(0,-2);
  }

  getDayNameShort(day) {
    switch(day) {
      case 'mon':
        return 'pon';
      case 'tue':
        return 'wt';
      case 'wed':
        return 'śr';
      case 'thu':
        return 'czw';
      case 'fri':
        return 'pt';
      case 'sat':
        return 'sob';
      case 'sun':
        return 'nd';
    }
  }

  toggleAlarmStatus(index) {
    this.alarms[index].active = !this.alarms[index].active;
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

  getSubject() {
    return this.clockSubject;
  }

  getTimeSubject(objectName) {
    return this[objectName].timeSubject;
  }

  getDateSubject() {
    return this.clock.dateSubject;
  }

  getMomentSubject() {
    return this.clock.momentSubject;
  }

  getAlarmsSubject() {
    return this.alarmsSubject;
  }

  getNewAlarmTimeSubject() {
    return this.newAlarm.timeSubject;
  }

  getNewAlarmRepeatSubject() {
    return this.newAlarm.repeatSubject;
  }

  getNow() {
    return this.now;
  }
}
