import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseService } from 'app/core/services/firebase.service';
import { ClockService } from 'app/modules/home/clock.service';

@Component({
  selector: 'app-alarm-firing',
  templateUrl: './alarm-firing.component.html',
  styleUrls: ['./alarm-firing.component.scss'],
})
export class AlarmFiringComponent {
  // private alarmSound;
  // public snoozeLength = 10;
  // private increaseVolumeOverTime = true;
  // private timeForIncreasingVolume = 30;
  // public timezone$;
  // public newAlarmTime = null;
  // currentDate$: Observable<Date>;
  // private currentDateSubscription;
  // constructor(
  //   private clockService: ClockService,
  //   private firebaseService: FirebaseService,
  //   private router: Router
  // ) {
  // this.timezone$ = this.firebaseService.getDeviceData('settings').pipe(
  //   map((res: any) => {
  //     return res ? res.timezone : null;
  //   })
  // );
  // this.currentDate$ = this.clockService.currentDate$;
  // }
  // ngOnInit() {
  //   this.currentDateSubscription = this.currentDate$.subscribe(
  //     (currentDate: Date) => {
  //       if (
  //         (!this.newAlarmTime ||
  //           this.newAlarmTime.isSameOrBefore(currentDate)) &&
  //         !this.alarmSound.playing()
  //       ) {
  //         this.newAlarmTime = null;
  //         this.alarmSound.play();
  //         if (this.increaseVolumeOverTime) {
  //           this.alarmSound.fade(0, 1, 1000 * this.timeForIncreasingVolume); // Increase volume in this time(1s*15)
  //         } else {
  //           this.alarmSound.fade(0, 1, 100);
  //         }
  //       }
  //     }
  //   );
  // }
  // ngOnDestroy() {
  //   this.currentDateSubscription.unsubscribe();
  // }
  // setAlarmSound(src: string) {
  //   this.alarmSound.src = src;
  // }
  // setSnoozeLenght(lenght: number) {
  //   this.snoozeLength = lenght;
  // }
  // setIncresingVolume(value: boolean) {
  //   this.increaseVolumeOverTime = value;
  // }
  // onSnooze() {
  //   if (this.newAlarmTime == null) {
  //     this.alarmSound.stop();
  //     this.newAlarmTime = new Date();
  //     this.newAlarmTime.setMinutes(
  //       this.newAlarmTime.getMinutes() + this.snoozeLength
  //     );
  //   }
  // }
  // onTurnOff() {
  //   this.alarmSound.stop();
  //   this.router.navigate(['']);
  // }
}
