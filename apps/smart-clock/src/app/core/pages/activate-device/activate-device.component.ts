import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  DeviceCodeResponse,
} from 'app/auth/services/auth.service';

@Component({
  selector: 'app-activate-device',
  templateUrl: './activate-device.component.html',
  styleUrls: ['./activate-device.component.scss'],
})
export class ActivateDeviceComponent implements OnInit {
  deviceCodeResponse: DeviceCodeResponse;
  success: boolean;

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    if (!this.authService.isAuthenticated()) {
      this.deviceCodeResponse = await this.authService.requestDeviceCode();

      if (this.deviceCodeResponse) {
        this.authService
          .requestToken(
            this.deviceCodeResponse.device_code,
            this.deviceCodeResponse.interval
          )
          .subscribe({
            complete: () => (this.success = true),
            error: () => (this.success = false),
          });
      }
    } else {
      this.success = true;
    }
  }
}
