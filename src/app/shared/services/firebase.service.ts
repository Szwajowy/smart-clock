import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { first, switchMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  private serial = "testSerialID";

  constructor(private firebaseDb: AngularFireDatabase) {}

  getUserData(part: string) {
    return this.firebaseDb
      .list("users")
      .valueChanges()
      .pipe(
        first(),
        switchMap((users: any) => {
          let found = false;
          for (let user in users) {
            for (let device in users[user].devices) {
              if (device.toString() === this.serial.toString()) {
                found = true;
              }
            }
            if (found) {
              return of(users[user][part]);
            }
          }
          if (!found) return of(null);
        })
      );
  }

  getDeviceData(part: string) {
    return this.firebaseDb
      .object(`devices/${this.serial}/${part}`)
      .valueChanges();
  }

  getDeviceDataList(part: string) {
    return this.firebaseDb
      .list(`devices/${this.serial}/${part}`)
      .valueChanges();
  }

  setDeviceData(part: string, data: any) {
    return this.firebaseDb.object(`devices/${this.serial}/${part}`).set(data);
  }

  setSerial(serial: string) {
    this.serial = serial;
  }
}
