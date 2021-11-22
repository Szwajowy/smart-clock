export const DEFAULT_DEVICE_INFO: DeviceInfo = {
  hardware: "",
  model: "",
  revision: "",
  serial: "testSerialId",
  processors: [],
};

export interface DeviceInfo {
  hardware: string;
  model: string;
  revision: string;
  serial: string;
  processors: ProcessorInfo[];
}

export interface ProcessorInfo {
  cpuArchitecture: string;
  features: string[];
  modelName: string;
  processor: string;
}
