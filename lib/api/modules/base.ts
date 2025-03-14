import axios from 'axios';
import { AxiosError } from 'axios';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export async function retryRequest(fn: () => Promise<any>, retries = MAX_RETRIES): Promise<any> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error instanceof AxiosError && (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK')) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
}

// Base API clients
export const f1RacingClient = axios.create({
  baseURL: 'https://ergast.com/api/f1',
  params: { format: 'json' },
  timeout: 10000
});

export const ergastClient = axios.create({
  baseURL: 'https://ergast.com/api/f1',
  params: { format: 'json' },
  timeout: 10000
});

export const openF1Client = axios.create({
  baseURL: 'https://api.openf1.org/v1',
  timeout: 10000
});