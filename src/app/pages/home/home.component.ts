import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import {} from "rxjs/operators";

import { ClockService } from "app/shared/services/clock.service";
import { FirebaseService } from "@shared/services/firebase.service";
import { of } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  helloMsg = "Witaj";
  navigation = {
    top: "/alarms",
    right: "/weather/today",
    bottom: "/stopwatch",
    left: "/settings",
  };

  private now;
  public timezone$;
  private momentSubscription;

  constructor(
    private clockService: ClockService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.now = this.clockService.getNow();
    this.setHelloMsg();

    this.timezone$ = this.firebaseService.getDeviceData("settings").pipe(
      map((res: any) => {
        console.log(res);
        return res.timezone;
      })
    );

    this.momentSubscription = this.clockService
      .getMomentSubject()
      .subscribe((res) => {
        this.now = res;
        this.setHelloMsg();
      });
  }

  ngOnDestroy() {
    this.momentSubscription.unsubscribe();
  }

  setHelloMsg() {
    if (!this.now) return;

    if (this.now.getHours() < 18 && this.now.getHours() >= 5) {
      this.helloMsg = "Dzień dobry";
    } else if (this.now.getHours() < 21 && this.now.getHours() >= 18) {
      this.helloMsg = "Dobry wieczór";
    } else {
      this.helloMsg = "Dobranoc";
    }
  }

  getNow() {
    return this.now;
  }

  onSwipeLeft() {
    if (this.navigation.right) this.router.navigate([this.navigation.right]);
  }

  onSwipeRight() {
    if (this.navigation.left) this.router.navigate([this.navigation.left]);
  }

  onSwipeUp() {
    if (this.navigation.bottom) this.router.navigate([this.navigation.bottom]);
  }

  onSwipeDown() {
    if (this.navigation.top) this.router.navigate([this.navigation.top]);
  }
}
