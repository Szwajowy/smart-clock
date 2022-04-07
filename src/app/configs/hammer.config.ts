import { Injectable } from "@angular/core";
import { HammerGestureConfig } from "@angular/platform-browser";

import * as Hammer from "hammerjs";

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides: { [key: string]: Object } = {
    swipe: { velocity: 0.4, threshold: 10, direction: Hammer.DIRECTION_ALL }, // override default settings
  };
}
