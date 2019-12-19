import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ClockService } from 'src/app/clock.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public navigation = {
    top: '/alarms',
    right: '/weather/today',
    bottom: '/stopwatch',
    left: '/calendar'
  };

  private now;
  private momentSubscription;

  constructor(private clockService: ClockService, private router: Router) { }

  ngOnInit() {
    this.now = this.clockService.getNow();
    this.momentSubscription = this.clockService.getMomentSubject().subscribe(res => {
      this.now = res;
    })
  }

  ngOnDestroy() {
    this.momentSubscription.unsubscribe();
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
