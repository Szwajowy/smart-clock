import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { CalendarService, Event } from "@shared/services/calendar.service";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements OnInit {
  public navigation = {
    top: "",
    right: "/settings",
    bottom: "",
    left: "/weather/today"
  };

  public events$: Observable<{ today: Event[]; tommorow: Event[] }>;

  constructor(
    private router: Router,
    public calendarService: CalendarService
  ) {}

  ngOnInit() {
    this.events$ = this.calendarService.getFirebaseCalendar();
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
