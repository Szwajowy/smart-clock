import { Component, OnInit, OnDestroy } from '@angular/core';
import { notificationSlide } from 'app/animations';

import { NotificationsService } from './notifications.service';

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
  
  getActiveNotification() {
    return this.notificationsService.getActiveNotification();
  }

  onPreviousNotification () {
    this.notificationsService.previousNotification();
  }

  onNextNotification () {
    this.notificationsService.nextNotification();
  }

  onSwipeLeft() {
    this.onNextNotification();
  }

  onSwipeRight() {
    this.onPreviousNotification();
  }
}
