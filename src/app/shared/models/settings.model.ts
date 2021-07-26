import { ClockStyle } from "./clock-style.enum";
import { ThemeName } from "./theme-name.enum";
import { Timezone } from "./timezone.model";

export interface Settings {
  activeTheme: ThemeName;
  clockStyle: ClockStyle;
  city: string;
  updateTime: number;
  timezone: Timezone;
  lastUpdate: number;
}
