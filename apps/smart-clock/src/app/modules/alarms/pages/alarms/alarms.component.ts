import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { Alarm } from "@shared/models/alarm.model";
import { ApplicationPage } from "@shared/models/application-page.model";
import { AlarmsService } from "../../alarms.service";

@Component({
  selector: "app-alarms",
  templateUrl: "./alarms.component.html",
  styleUrls: ["./alarms.component.scss"],
})
export class AlarmsComponent extends ApplicationPage implements OnInit {
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

  constructor(router: Router, private alarmsService: AlarmsService) {
    super(router);
  }

  ngOnInit() {
    this.alarms$ = this.alarmsService.alarms$;
    this.editedAlarmId$ = this.alarmsService.editedAlarmId$;
  }

  // EVENT FUNCTIONS
  onCreateAlarm() {
    this.alarmsService.createAlarm();
  }

  onEditAlarm(id: number) {
    this.alarmsService.editAlarm(id);
  }
}
