import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { AlarmsService } from "@shared/services/alarms.service";

import { Alarm } from "@shared/models/alarm.model";
import { take } from "rxjs/operators";

@Component({
  selector: "app-alarms",
  templateUrl: "./alarms.component.html",
  styleUrls: ["./alarms.component.scss"],
})
export class AlarmsComponent implements OnInit {
  // NAVIGATION CONFIGURATION
  public navigation = {
    top: "/timer",
    right: "/weather/today",
    bottom: "/",
    left: "/calendar",
  };

  // SUBJECTS
  editedAlarmId$: Subject<number>;
  alarms$: Subject<Alarm[]>;

  constructor(private alarmsService: AlarmsService, private router: Router) {}

  ngOnInit() {
    this.alarms$ = this.alarmsService.alarms$;
    this.editedAlarmId$ = this.alarmsService.editedAlarmId$;
  }

  // EVENT FUNCTIONS
  onCreateAlarm() {
    let alarmsLenght: number;
    this.alarms$.pipe(take(1)).subscribe((alarms: Alarm[]) => {
      alarmsLenght = alarms.length;
    });

    this.editedAlarmId$.next(alarmsLenght);
  }

  onEditAlarm(id: number) {
    this.editedAlarmId$.next(id);
    this.alarmsService.setEditedAlarmTo(id);
  }

  onCloseEdit() {}

  // NAVIGATION
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
