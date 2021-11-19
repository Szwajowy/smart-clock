import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";
import { Howl } from "howler";

import { ClockService } from "app/pages/home/clock.service";
import { FirebaseService } from "@shared/services/firebase.service";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "app-alarm-firing",
  templateUrl: "./alarm-firing.component.html",
  styleUrls: ["./alarm-firing.component.scss"],
})
export class AlarmFiringComponent implements OnInit, OnDestroy {
  private alarmSound = new Howl({
    src: "../../../../assets/audio/alarm-sound.mp3",
    preload: true,
    loop: true,
    volume: 0,
  });

  public snoozeLength = 10;

  private increaseVolumeOverTime = true;
  private timeForIncreasingVolume = 30;

  public timezone$ = this.firebaseService.getDeviceData("settings").pipe(
    map((res: any) => {
      return res ? res.timezone : null;
    })
  );
  public newAlarmTime = null;

  currentDate$: Observable<Date> = this.clockService.currentDate$;
  private currentDateSubscription;

  constructor(
    private clockService: ClockService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentDateSubscription = this.currentDate$.subscribe(
      (currentDate: Date) => {
        if (
          (!this.newAlarmTime ||
            this.newAlarmTime.isSameOrBefore(currentDate)) &&
          !this.alarmSound.playing()
        ) {
          this.newAlarmTime = null;
          this.alarmSound.play();
          if (this.increaseVolumeOverTime) {
            this.alarmSound.fade(0, 1, 1000 * this.timeForIncreasingVolume); // Increase volume in this time(1s*15)
          } else {
            this.alarmSound.fade(0, 1, 100);
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.currentDateSubscription.unsubscribe();
  }

  setAlarmSound(src: string) {
    this.alarmSound.src = src;
  }

  setSnoozeLenght(lenght: number) {
    this.snoozeLength = lenght;
  }

  setIncresingVolume(value: boolean) {
    this.increaseVolumeOverTime = value;
  }

  onSnooze() {
    if (this.newAlarmTime == null) {
      this.alarmSound.stop();

      this.newAlarmTime = moment().add(0, "h").add(this.snoozeLength, "m");
    }
  }

  onTurnOff() {
    this.alarmSound.stop();
    this.router.navigate([""]);
  }
}
