import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Howl } from 'howler';

import { ClockService } from 'app/shared/services/clock.service';

@Component({
  selector: 'app-alarm-firing',
  templateUrl: './alarm-firing.component.html',
  styleUrls: ['./alarm-firing.component.scss']
})
export class AlarmFiringComponent implements OnInit, OnDestroy {

  private alarmSound = new Howl({
    src: '../../../../assets/audio/alarm-sound.mp3',
    preload: true,
    loop: true,
    volume: 0,
  });

  private now;
  private newAlarmTime = null;

  private momentSubscription;

  constructor(private clockService: ClockService, private router: Router) { }

  ngOnInit() {
    this.now = this.clockService.getNow();
    this.momentSubscription = this.clockService.getMomentSubject().subscribe(res => {
      this.now = res;

      if((!this.newAlarmTime || this.newAlarmTime.isSameOrBefore(this.now)) && !this.alarmSound.playing()) {
        this.newAlarmTime = null;
        this.alarmSound.play();
        this.alarmSound.fade(0, 1, 1000*30); // Increase volume in this time(1s*15)
      }
    });
  }

  ngOnDestroy() {
    this.momentSubscription.unsubscribe();
  }

  getNow() {
    return this.now;
  }

  onSnooze() {
    if(this.newAlarmTime == null) {
      this.alarmSound.stop();

      this.newAlarmTime = moment().add(1, 'h').add(10, 'm');
    }
  }

  onTurnOff() {
    this.alarmSound.stop();
    this.router.navigate(['']);
  }
}
