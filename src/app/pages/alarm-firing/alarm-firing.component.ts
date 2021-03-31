import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";
import { Howl } from "howler";

import { ClockService } from "app/shared/services/clock.service";
import { FirebaseService } from "@shared/services/firebase.service";
import { map } from "rxjs/operators";

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

  private now = this.clockService.getNow();
  public timezone;
  private timezoneSubscription;
  private newAlarmTime = null;

  public snoozeLenght = 10;

  private increseVolumeOverTime = true;
  private timeForIncreasingVolume = 30;

  private momentSubscription;

  constructor(
    private clockService: ClockService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.now = this.clockService.getNow();
    this.momentSubscription = this.clockService
      .getMomentSubject()
      .subscribe((res) => {
        this.now = res;

        if (
          (!this.newAlarmTime || this.newAlarmTime.isSameOrBefore(this.now)) &&
          !this.alarmSound.playing()
        ) {
          this.newAlarmTime = null;
          this.alarmSound.play();
          if (this.increseVolumeOverTime) {
            this.alarmSound.fade(0, 1, 1000 * this.timeForIncreasingVolume); // Increase volume in this time(1s*15)
          } else {
            this.alarmSound.fade(0, 1, 100);
          }
        }
      });
    this.timezoneSubscription = this.firebaseService
      .getDeviceData("settings")
      .pipe(
        map((res: any) => {
          return res ? res.timezone : null;
        })
      )
      .subscribe((timezone) => {
        this.timezone = timezone;
      });
  }

  ngOnDestroy() {
    this.momentSubscription.unsubscribe();
    this.timezoneSubscription.unsubscribe();
  }

  getNow() {
    return this.now;
  }

  setAlarmSound(src: string) {
    this.alarmSound.src = src;
  }

  setSnoozeLenght(lenght: number) {
    this.snoozeLenght = lenght;
  }

  setIncresingVolume(value: boolean) {
    this.increseVolumeOverTime = value;
  }

  onSnooze() {
    if (this.newAlarmTime == null) {
      this.alarmSound.stop();

      this.newAlarmTime = moment().add(0, "h").add(this.snoozeLenght, "m");
    }
  }

  onTurnOff() {
    this.alarmSound.stop();
    this.router.navigate([""]);
  }
}
