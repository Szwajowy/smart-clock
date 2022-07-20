import { ThemeName } from "./theme-name.enum";

export interface Theme {
  name: ThemeName;
  properties: {
    accent: string;
    accentLighter: string;
    backgroundImage: string;
    color: string;
    colorDarker: string;
    colorDarkest: string;
  };
}
