import axios, { AxiosInstance } from 'axios';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { LoginResponse } from '../types/api';

export const API_BASE_URL = 'https://app.tsi.sleeptracker.com';
export const AUTH_BASE_URL = 'https://auth.tsi.sleeptracker.com';

export const CLIENT_INFO = {
  clientID: 'sleeptracker-android-tsi',
  clientVersion: '1.9.47'
};

export async function authenticate(): Promise<string> {
  const { username, password } = await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Enter your SleepTracker email:',
      validate: (input) => input.length > 0 && input.includes('@')
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter your password:',
      validate: (input) => input.length > 0
    }
  ]);

  const spinner = ora('Logging in...').start();

  try {
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    const client = await createAuthClient();

    const response = await client.post<LoginResponse>('/v1/app/user/session', {
      ...CLIENT_INFO,
      id: 'TEST_ANDROID_getUserSession',
      scope: 'scope'
    }, {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    });

    if (response.data?.token) {
      spinner.succeed('Login successful!');
      return response.data.token;
    } else {
      spinner.fail('Login failed: No token received');
      throw new Error('No token received');
    }
  } catch (error) {
    spinner.fail('Login failed');
    throw error;
  }
}

export async function createApiClient(token?: string): Promise<AxiosInstance> {
  if (!token) {
    token = await authenticate();
  }
  
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Host': 'app.tsi.sleeptracker.com',
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
}

export async function createAuthClient(): Promise<AxiosInstance> {
  return axios.create({
    baseURL: AUTH_BASE_URL,
    headers: {
      'Host': 'auth.tsi.sleeptracker.com',
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
}

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 401) {
      throw new Error('Session expired. Please login again.');
    } else {
      throw new Error('API request failed');
    }
  }
  throw error instanceof Error ? error : new Error('Failed to connect to SleepTracker API');
} 