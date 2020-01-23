import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ClockService } from 'app/shared/services/clock.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  helloMsg = "Witaj";
  navigation = {
    top: '/alarms',
    right: '/weather/today',
    bottom: '/stopwatch',
    left: '/settings'
  };

  private now;
  private momentSubscription;

  constructor(private clockService: ClockService, private router: Router) { }

  ngOnInit() {
    this.now = this.clockService.getNow();
    this.setHelloMsg();

    this.momentSubscription = this.clockService.getMomentSubject().subscribe(res => {
      this.now = res;
      this.setHelloMsg();
    })
  }

  ngOnDestroy() {
    this.momentSubscription.unsubscribe();
  }

  setHelloMsg() {
    if(!this.now) 
      return;
      
    if(this.now.get('hours') < 18 && this.now.get('hours') >= 5) {
      this.helloMsg = "Dzień dobry";
    } else if(this.now.get('hours') < 21 && this.now.get('hours') >= 18) {
      this.helloMsg = "Dobry wieczór";
    } else {
      this.helloMsg = "Dobranoc";
    }
  }

  getNow() {
    return this.now;
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
