import chalk from 'chalk';
import { DevicesResponse, DeviceInfo } from './types/api';
import { createApiClient, CLIENT_INFO } from './utils/api';

async function displayDeviceInfo(device: DeviceInfo): Promise<void> {
  console.log(chalk.yellow('Bed ID: ') + device.deviceID);
  console.log(chalk.yellow('Name: ') + device.name);
  console.log(chalk.yellow('Model: ') + device.modelID);
  console.log(chalk.yellow('Firmware: ') + device.processorVersionFirmware);
  console.log(chalk.yellow('Status: ') + (device.active ? 'Active' : 'Inactive'));
  
  // WiFi Information
  console.log(chalk.yellow('WiFi Signal: ') + `${device.lastWiFiSignal}% (${device.wifiSignalGood ? 'Good' : 'Poor'})`);
  
  // Power Base Information
  if (device.powerBase) {
    console.log(chalk.yellow('Power Base: ') + device.powerBase.modelDescription);
  }
  
  console.log(chalk.gray('----------------------------------------'));
}

async function main() {
  try {
    const client = await createApiClient();

    const response = await client.post<DevicesResponse>('/actrack-client/v2/fpcsiot/processor/getByType', {
      ...CLIENT_INFO,
      id: 'TEST_ANDROID_cloudIoTDevicesGetByType',
      types: [1, 2, 4, 6]
    });

    if (response.data?.deviceList?.length > 0) {
      console.log(chalk.green('\nConnected beds:\n'));
      for (const device of response.data.deviceList) {
        await displayDeviceInfo(device);
      }
    } else {
      console.log(chalk.red('\nNo beds found'));
    }
  } catch (error) {
    console.error(chalk.red(`\nError: ${error instanceof Error ? error.message : 'Unknown error occurred'}`));
    process.exit(1);
  }
}

main(); 