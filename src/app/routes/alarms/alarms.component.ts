import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ClockService } from 'src/app/clock.service';

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.scss']
})
export class AlarmsComponent implements OnInit, OnDestroy {

  public navigation = {
    top: '/timer',
    right: '/weather/today',
    bottom: '/',
    left: '/calendar'
  };

  private creatingAlarm = false;

  private alarms;
  private newAlarm;

  public dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  private alarmsSubject;
  private newAlarmTimeSubject;
  private newAlarmRepeatSubject;

  constructor(private clockService: ClockService, private router: Router) { }

  ngOnInit() {
    this.alarms = this.clockService.getAlarms();
    this.alarmsSubject = this.clockService.getAlarmsSubject().subscribe(res => {
      this.alarms = res;
    });

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

  getDayNameShort(day) {
    return this.clockService.getDayNameShort(day);
  }

  getRepeatDays(index) {
    return this.clockService.getRepeatDays(index);
  }

  getAlarmTime(index, part) {
    return (this.alarms[index].time[part] < 10) ? "0" + this.alarms[index].time[part] : this.alarms[index].time[part].toString();
  }

  getNewAlarmTime(part) {
    return (this.newAlarm.time[part] < 10) ? "0" + this.newAlarm.time[part] : this.newAlarm.time[part].toString();
  }

  isDayAlreadyInRepeat(day) {
    return this.clockService.isDayAlreadyInRepeat(day);
  }

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
