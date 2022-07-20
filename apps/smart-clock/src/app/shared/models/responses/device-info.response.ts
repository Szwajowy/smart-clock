export interface DeviceInfoResponse {
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
