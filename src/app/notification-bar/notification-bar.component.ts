import { Component, OnInit, OnDestroy } from '@angular/core';
import { notificationSlide } from '../animations';

import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-notification-bar',
  animations: [
    notificationSlide
  ],
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit, OnDestroy {

  private notificationsSubscription;

  public activeNotification = 0;
  public notifications = [];
  
  constructor(private notificationsService: NotificationsService) { }

  ngOnInit() {
    this.notifications = this.notificationsService.getNotifications();
    
    this.notificationsSubscription = this.notificationsService.getNotificationsSubject().subscribe(res => {
      this.notifications = res;
    });
  }

  ngOnDestroy() {
    this.notificationsSubscription.unsubscribe();
  }

  onPreviousNotification () {
    if(this.activeNotification > 0) {
      this.activeNotification--;
    } else {
      this.activeNotification = this.notifications.length - 1;
    }

    console.log(this.notifications.length);
  }

  onNextNotification () {
    if(this.activeNotification < this.notifications.length - 1) {
      this.activeNotification++;
    } else {
      this.activeNotification = 0;
    }
  }

  onSwipeLeft() {
    this.onNextNotification();
  }

  onSwipeRight() {
    this.onPreviousNotification();
  }

  translateType(type: string) {
    switch(type) {
      case 'weather':
        return 'pogoda';
      case 'alarm':
        return 'alarm';
      case 'calendar':
        return 'kalendarz';
      case 'stopwatch':
        return 'stoper';
      case 'timer':
        return 'Minutnik';
      default:
        return type;
    }
  }
}
