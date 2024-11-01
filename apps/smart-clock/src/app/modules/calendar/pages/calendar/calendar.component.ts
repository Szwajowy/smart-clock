import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { ApplicationPage } from "@shared/models/application-page.model";
import { CalendarService } from "../../calendar.service";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent
  extends ApplicationPage
  implements OnInit, OnDestroy
{
  public navigation = {
    top: "",
    right: "/settings",
    bottom: "",
    left: "/weather/today",
  };

  private eventsSubscription: Subscription;

  public todayEvents = [];
  public tomorrowEvents = [];

  constructor(router: Router, public calendarService: CalendarService) {
    super(router);
  }

  ngOnInit() {
    this.eventsSubscription = this.calendarService
      .getFirebaseCalendar()
      .subscribe((events) => {
        this.todayEvents = [];
        this.tomorrowEvents = [];

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
}
