import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ClockService } from 'app/shared/services/clock.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {

  public navigation = {
    top: '/stopwatch',
    right: '/weather/today',
    bottom: '/alarms',
    left: '/calendar'
  };

  public time = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  };

  private infinityScroll = true;

  private clockSubject;

  constructor(private clockService: ClockService, private router: Router) { }

  ngOnInit() {
    this.time = this.clockService.getTime('timer');
    
    this.clockSubject = this.clockService.getTimeSubject('timer').subscribe(res => {
      this.time = res;
    });
  }

  ngOnDestroy() {
    this.clockSubject.unsubscribe();
  }

  getTime(part) {
    return (this.time[part] < 10) ? "0" + this.time[part] : this.time[part].toString();
  }

  isRunning() {
    return this.clockService.isRunning("timer");
  }

  isPaused() {
    return this.clockService.isPaused('timer');
  }

  onIncrease(part) {
    this.clockService.increaseTime('timer', part, {infinityScroll: this.infinityScroll});
  }

  onDecrease(part) {
    this.clockService.decreaseTime('timer', part, {infinityScroll: this.infinityScroll});
  }

  onStartPause() {
    this.clockService.startPause('timer');
  }

  onStop() {
    this.clockService.stop('timer')
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
