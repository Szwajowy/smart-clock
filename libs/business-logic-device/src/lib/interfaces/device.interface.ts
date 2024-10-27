export interface Device {
  name: string;
  serial: string;
  settings: {
    clockType: number;
  };
}
