import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";

import { CalendarService, Event } from "@shared/services/calendar.service";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements OnInit, OnDestroy {
  public navigation = {
    top: "",
    right: "/settings",
    bottom: "",
    left: "/weather/today",
  };

  private eventsSubscription: Subscription;

  public todayEvents = [];
  public tomorrowEvents = [];

  constructor(
    private router: Router,
    public calendarService: CalendarService
  ) {}

  ngOnInit() {
    this.eventsSubscription = this.calendarService
      .getFirebaseCalendar()
      .subscribe((events) => {
        this.todayEvents = [];
        this.tomorrowEvents = [];
        console.log(events.today);

        events.today.forEach((event) => {
          this.todayEvents.push(event);
        });
        events.tomorrow.forEach((event) => {
          this.tomorrowEvents.push(event);
        });
      });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  isToday(date: string, shift?: number) {
    this.calendarService.isDaysFromToday(date, shift);
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
