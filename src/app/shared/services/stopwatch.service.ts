import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AdjustingInterval } from '../models/adjusting-interval.model';
import { TimeCounter } from '../models/time-counter.model';

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {
  private _time = new TimeCounter();
  private running = false;
  private paused = false;
  private interval = new AdjustingInterval(this.countUp.bind(this), 10);

  get time() {
    return this._time;
  }

  countUp() {
    if(!this.paused) {
      if(this.time.increment('milliseconds') === false) {
        this.stop();
      }

      // SEND NOTIFICATION
      // this.notificationsService.getInputNotificationsSubject().next({
      //   type: 'timer',
      //   operation: 'post',
      //   content: this.pad(this.timer.time.hours) + ':' + 
      //            this.pad(this.timer.time.minutes) + ':' + 
      //            this.pad(this.timer.time.seconds),
      //   icon: 'stopwatch',
      // });
    }
  }

  startPause() {
    if(!this.running) {
      this.running = true;
      this.interval.start();
    } else if(!this.paused) {
      this.paused = true;
      
      // SEND NOTIFICATION
      // this.notificationsService.getInputNotificationsSubject().next({
      //   type: objectName,
      //   operation: 'post',
      //   content: objectName === 'timer' ? 'Minutnik został wstrzymany!' : 'Stoper został wstrzymany!',
      //   icon: 'stopwatch',
      // });
    } else {
      this.paused = false;
    }
  }

  // STOP STOPWATCH
  stop() {
    this.interval.stop();

    this.running = false;
    this.paused = false;
    
    this.time.reset();

    // SEND NOTIFICATION
    // this.notificationsService.getInputNotificationsSubject().next({
    //   type: objectName,
    //   operation: 'remove',
    //   content: null,
    //   icon: null,
    // });
  }

  isPaused() {
    return this.paused;
  }

  isRunning() {
    return this.running;
  }
}