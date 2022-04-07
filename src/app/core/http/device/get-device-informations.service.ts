import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DeviceInfoResponse } from "@shared/models/responses/device-info.response";
import { environment } from "environments/environment";
import { catchError, Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GetDeviceInformationsService {
  constructor(private http: HttpClient) {}

  getDeviceInfo(): Observable<{ result: DeviceInfoResponse }> {
    return this.http
      .get<{ result: DeviceInfoResponse }>(
        environment.helperApi.url + "/device_info"
      )
      .pipe(
        catchError((error) => {
          // TODO: Display message to user
          return of({
            result: {
              hardware: "",
              model: "",
              revision: "",
              serial: "testSerialId",
              processors: [],
            },
          });
        })
      );
  }
}
