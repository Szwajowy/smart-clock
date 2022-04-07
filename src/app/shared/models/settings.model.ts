import { ClockStyle } from "./clock-style.model";
import { ThemeName } from "./theme-name.enum";
import { Timezone } from "./timezone.model";

export interface Settings {
  activeTheme: ThemeName;
  brightness: number;
  clockStyle: ClockStyle;
  city: string;
  updateTime: number;
  timezone: Timezone;
  lastUpdate: number;
}
