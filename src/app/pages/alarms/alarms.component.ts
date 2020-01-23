import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ClockService } from 'app/shared/services/clock.service';

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.scss']
})
export class AlarmsComponent implements OnInit, OnDestroy {

  // NAVIGATION CONFIGURATION
  public navigation = {
    top: '/timer',
    right: '/weather/today',
    bottom: '/',
    left: '/calendar'
  };

  // VARIABLES READ IN TEMPLATES
  creatingAlarm = false;
  alarms;
  newAlarm;

  public dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  // SUBJECTS
  private alarmsSubject;
  private newAlarmTimeSubject;
  private newAlarmRepeatSubject;

  constructor(private clockService: ClockService, private router: Router) { }

  ngOnInit() {
    this.alarms = this.clockService.getAlarms();
    this.alarmsSubject = this.clockService.getAlarmsSubject().subscribe(res => {
      this.alarms = res;
    });

    // TODO: CHANGE IT TO ONE SUBJECT
    this.newAlarm = this.clockService.getNewAlarm();
    this.newAlarmTimeSubject = this.clockService.getNewAlarmTimeSubject().subscribe(res => {
      this.newAlarm.time = res;
    });
    this.newAlarmRepeatSubject = this.clockService.getNewAlarmRepeatSubject().subscribe(res => {
      this.newAlarm.repeat = res;
    });
  }

  ngOnDestroy() {
    this.alarmsSubject.unsubscribe();
    this.newAlarmTimeSubject.unsubscribe();
    this.newAlarmRepeatSubject.unsubscribe();
  }

  // FUNCTIONS FOR DISPLAYING LIST OF ALARMS
  getTime(alarm, part) {
    return (alarm.time[part] < 10) ? "0" + alarm.time[part] : alarm.time[part].toString();
  }

  getRepeatDays(alarm) {
    let stringResult = '';

    for(const key in alarm.repeat) {
      if(alarm.repeat[key] === true)
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

  // NEW ALARM FUNCTIONS
  getNewAlarmTime(part) {
    return (this.newAlarm.time[part] < 10) ? "0" + this.newAlarm.time[part] : this.newAlarm.time[part].toString();
  }

  isDayAlreadyInRepeat(day) {
    return this.clockService.isDayAlreadyInRepeat(day);
  }

  // EVENT FUNCTIONS
  onAddAlarm() {
    this.creatingAlarm = true;
  }

  onCreateAlarm() {
    this.clockService.addNewAlarm();
    this.creatingAlarm = false;
  }

  onCancel() {
    this.creatingAlarm = false;
    this.clockService.clearNewAlarm();
  }

  onIncrease(part) {
    this.clockService.increaseTime('newAlarm', part, {limitHours: 23, infinityScroll: true});
  }

  onDecrease(part) {
    this.clockService.decreaseTime('newAlarm', part, {limitHours: 23, infinityScroll: true});
  }

  onToggleDay(day) {
    this.clockService.toggleRepeatDay(day);
  }

  onAlarmToggleStatus(index) {
    this.clockService.toggleAlarmStatus(index);
  }

  // NAVIGATION
  onSwipeLeft() {
    if(this.navigation.right)
      this.router.navigate([this.navigation.right]);
  }

  onSwipeRight() {
    if(this.navigation.left)
    this.router.navigate([this.navigation.left]);
  }

  onSwipeUp() {
    if(this.navigation.bottom)
    this.router.navigate([this.navigation.bottom]);
  }

  onSwipeDown() {
    if(this.navigation.top)
    this.router.navigate([this.navigation.top]);
  }
}
