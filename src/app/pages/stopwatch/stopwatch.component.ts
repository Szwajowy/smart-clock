import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ClockService } from 'app/shared/services/clock.service';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent implements OnInit, OnDestroy {

  public navigation = {
    top: '/',
    right: '/weather/today',
    bottom: '/timer',
    left: '/calendar'
  };

  public time = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  };

  private clockSubject;
  
  constructor(private clockService: ClockService, private router: Router) { }

  ngOnInit() {
    this.time = this.clockService.getTime('stopwatch');
    
    this.clockSubject = this.clockService.getTimeSubject('stopwatch').subscribe(res => {
      this.time = res;
    });
  }

  ngOnDestroy() {
    this.clockSubject.unsubscribe();
  }

  getTime(part) {
    if(part != 'hours')
      return (this.time[part] < 10) ? "0" + this.time[part] : this.time[part].toString();
  
    return this.time[part];
  }

  getHoursText() {
    switch(this.time.hours) {
      case 1:
        return 'godzina';
      case 2:
      case 3:
      case 4:
        return 'godziny';
      default:
        return 'godzin';
    }
  }

  isRunning() {
    return this.clockService.isRunning("stopwatch");
  }

  isPaused() {
    return this.clockService.isPaused('stopwatch');
  }

  onStartPause() {
    this.clockService.startPause('stopwatch');
  }

  onStop() {
    this.clockService.stop('stopwatch')
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
