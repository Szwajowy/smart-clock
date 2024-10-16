import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { provideFirebaseApp } from "@angular/fire/app";
import { provideAuth } from "@angular/fire/auth";
import { provideDatabase } from "@angular/fire/database";
import {
  BrowserModule,
  HammerModule,
  HAMMER_GESTURE_CONFIG,
} from "@angular/platform-browser";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

import { environment } from "environments/environment";
import { MyHammerConfig } from "app/configs/hammer.config";
import { GetDeviceBacklightBrightnessService } from "./http/device/get-device-backlight-brightness.service";
import { GetDeviceInformationsService } from "./http/device/get-device-informations.service";
import { SetDeviceBacklightBrightnessService } from "./http/device/set-device-backlight-brightness.service";
import { FirebaseService } from "./services/firebase.service";
import { ThemeService } from "./services/theme.service";

@NgModule({ declarations: [],
    exports: [], imports: [BrowserModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideDatabase(() => getDatabase()),
        provideAuth(() => getAuth()),
        HammerModule], providers: [
        GetDeviceInformationsService,
        GetDeviceBacklightBrightnessService,
        SetDeviceBacklightBrightnessService,
        FirebaseService,
        ThemeService,
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig,
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class CoreModule {}
