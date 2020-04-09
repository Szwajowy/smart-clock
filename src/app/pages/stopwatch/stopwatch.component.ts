import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ClockService } from 'app/shared/services/clock.service';
import { StopwatchService } from 'app/shared/services/stopwatch.service';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent {

  public navigation = {
    top: '/',
    right: '/weather/today',
    bottom: '/timer',
    left: '/calendar'
  };

  constructor(
    public stopwatchService: StopwatchService, 
    private router: Router
    ) { }
  
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
