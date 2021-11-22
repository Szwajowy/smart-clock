import { Injectable } from "@angular/core";
import { FirebaseService } from "../../shared/services/firebase.service";
import { first, switchMap } from "rxjs/operators";
import { of } from "rxjs";

export interface Event {
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  constructor(private firebaseService: FirebaseService) {}

  getFirebaseCalendar() {
    return this.firebaseService.getUserData("events").pipe(
      first(),
      switchMap((events: Event[]) => {
        let todayList = [];
        let tomorrowList = [];

        for (let event in events) {
          if (this.isDaysFromToday(events[event].start.dateTime, 0)) {
            todayList.push(events[event]);
          } else if (this.isDaysFromToday(events[event].start.dateTime, 1)) {
            tomorrowList.push(events[event]);
          }
        }

        return of({ today: todayList, tomorrow: tomorrowList });
      })
    );
  }

  isDaysFromToday(date: string, shift?: number) {
    let currentDate = new Date();
    if (shift) currentDate.setDate(currentDate.getDate() + shift);
    let passedDate = new Date(date);

    if (
      currentDate.getDate() === passedDate.getDate() &&
      currentDate.getMonth() === passedDate.getMonth() &&
      currentDate.getFullYear() === passedDate.getFullYear()
    ) {
      return true;
    } else {
      return false;
    }
  }
}
