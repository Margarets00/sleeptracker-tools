export interface SensorReading {
  value: number;
  units: string;
}

export interface SensorData {
  temp?: SensorReading;
  humidity?: SensorReading;
  iaq?: SensorReading;
}

export interface EnvironmentSensor {
  model: string;
  reading?: {
    sensors: SensorData[];
  };
}

export interface PowerBaseInfo {
  modelNumber: string;
  modelDescription: string;
  powerbaseControllerFirmwareID: number;
  releaseYYMM: string;
  baseModel: string;
  size: string;
  foundationSizeCode: number;
  supported: boolean;
  antiSnorePresetSupported: boolean;
  antiSnorePulseCount1: number;
  antiSnorePulseCount2: number;
  headAngleTicksPerDegree: number;
  footAngleTicksPerDegree: number;
}

export interface DeviceInfo {
  deviceID: number;
  sleeptrackerID: number;
  sleeptrackerProcessorID: number;
  entangledProcessorID: number | null;
  isPrimary: boolean | null;
  name: string;
  type: number;
  active: boolean;
  macAddress: string;
  processorVersionHardware: string | null;
  processorVersionOS: string | null;
  processorVersionFirmware: string;
  unitNumber: number;
  lastDataSlotGMTSecs: number;
  lastHeartbeatGMTSecs: number;
  health: number;
  scannedSerialNumber: string | null;
  processorSerialNumber: string;
  processorCreateTimeGMTSecs: number;
  bedSize: number;
  brandID: number;
  packageID: number | null;
  modelID: string;
  mattressBrandID: number | null;
  mattressBrandName: string | null;
  mattressAgeYearPurchased: number | null;
  timeZone: string;
  lastWiFiRSSI: number;
  lastWiFiSignal: number;
  wifiSignalGood: boolean;
  baseSmartCableSupported: boolean;
  baseTandem: boolean;
  baseUnsynchronized: boolean;
  baseMotorsReversed: boolean;
  foundationSizeCode: number;
  mattressConfigurationCode: number;
  powerBaseSerialNumber: string;
  powerBase: PowerBaseInfo;
  enableDataPause: boolean;
  activeAdaptBedInfo: any | null;
}

export interface DevicesResponse {
  statusCode: number;
  statusMessage: string;
  id: string;
  deviceList: DeviceInfo[];
}

export interface HelloResponse {
  helloData: {
    product: string;
    productModel: string;
    Serial: string;
    macAddress: string;
    leftSensor: {
      status: string;
    };
    rightSensor: {
      status: string;
    };
    sensors?: EnvironmentSensor[];
    wifi?: {
      wifi: string;
      signalStrength: number;
      ip: string;
    };
    uptime?: {
      string: string;
    };
  };
}

export interface TOSData {
  consent: boolean;
  latestAcceptedVersion: number;
  timestampSecs: number;
  latestTermsAccepted: boolean;
  currentVersion: number;
}

export interface LoginResponse {
  statusCode: number;
  statusMessage: string;
  id: string;
  token: string;
  expirationTimeSecs: number;
  username: string;
  TOS: TOSData;
  userIDToken: string;
  restricted: boolean;
  usernameVerified: number;
  activeAdaptUserGUID: string;
} 