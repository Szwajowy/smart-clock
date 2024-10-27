import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import { bufferTime } from 'rxjs/operators';

@Injectable()
export class NotificationsService {
  private inputNotificationsSubject = new Subject<{
    type: string;
    operation: string;
    content: string;
    icon: string;
  }>();
  private notificationsSubject = new BehaviorSubject<[]>([]);

  private activeNotification = 0;
  private notifications = [];

  subscribeToAll() {
    this.inputNotificationsSubject // NEEDS BUFFERING FOR AT LEAST 1s
      .pipe(bufferTime(1000))
      .subscribe((notificationsList) => {
        const finalNotificationsList = [];
        let indexOfExistingNot;

        notificationsList.forEach((notification) => {
          indexOfExistingNot = finalNotificationsList.findIndex(
            (finalNotification) => finalNotification.type === notification.type,
          );

          if (indexOfExistingNot === -1) {
            finalNotificationsList.push(notification);
          } else {
            finalNotificationsList[indexOfExistingNot] = notification;
          }
        });

        // CHECK IF NOTIFICATION EXIST
        finalNotificationsList.forEach((res) => {
          if (res.operation === 'post') {
            let notificationExist = false;

            this.notifications.forEach((notification, index) => {
              if (notification.type === res.type) {
                this.notifications[index] = {
                  type: res.type,
                  icon: res.icon,
                  message: res.content,
                };
                notificationExist = true;
              }
            });

            if (!notificationExist) {
              if (res.type === 'weather') {
                this.notifications.unshift({
                  type: res.type,
                  icon: res.icon,
                  message: res.content,
                });
              } else {
                this.notifications.push({
                  type: res.type,
                  icon: res.icon,
                  message: res.content,
                });
              }
            }

            this.getNotificationsSubject().next(this.notifications as []);
          } else if (res.operation === 'remove') {
            this.notifications.forEach((notification, index) => {
              if (notification.type == res.type) {
                this.notifications.splice(index, 1);
                if (index === this.activeNotification)
                  this.activeNotification--;
              }
            });
          }
        });
      });
  }

  previousNotification() {
    if (this.activeNotification !== 0) {
      if (this.activeNotification > 0) {
        this.activeNotification--;
      } else {
        this.activeNotification = this.notifications.length - 1;
      }
    }
  }

  nextNotification() {
    if (this.activeNotification !== this.notifications.length - 1) {
      if (this.activeNotification < this.notifications.length - 1) {
        this.activeNotification++;
      } else {
        this.activeNotification = 0;
      }
    }
  }

  getInputNotificationsSubject() {
    return this.inputNotificationsSubject;
  }

  getNotificationsSubject() {
    return this.notificationsSubject;
  }

  getActiveNotification() {
    return this.activeNotification;
  }

  getNotifications() {
    return this.notifications;
  }
}
