import { Injectable } from "@angular/core";
import { Database, listVal, objectVal } from "@angular/fire/database";
import { switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { ref, set } from "firebase/database";

@Injectable()
export class FirebaseService {
  private serial;

  constructor(private db: Database) {}

  getUserData(part: string) {
    return listVal(ref(this.db, "users")).pipe(
      switchMap((users: any) => {
        let found = false;
        let foundUser = null;
        for (let user in users) {
          for (let device in users[user].devices) {
            if (
              users[user].devices[device].id.toString() ===
              this.serial?.toString()
            ) {
              foundUser = user;
              found = true;
            }
          }
        }

        if (found) {
          return of(users[foundUser][part]);
        }

        if (!found) return of(null);
      })
    );
  }

  getDeviceData(part: string) {
    return objectVal(ref(this.db, `devices/${this.serial}/${part}`));
  }

  getDeviceDataList(part: string) {
    return listVal(ref(this.db, `devices/${this.serial}/${part}`));
  }

  setDeviceData(part: string, data: any) {
    return set(ref(this.db, `devices/${this.serial}/${part}`), data);
  }

  setSerial(serial: string) {
    this.serial = serial;
  }
}
