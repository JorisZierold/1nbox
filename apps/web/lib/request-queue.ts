import PQueue from "p-queue";

interface RateLimit {
  intervalCap: number;
  interval: number;
  timeout?: number;
  concurrency?: number;
}

export class RequestQueue {
  pQueue: PQueue;

  constructor(public identifier: string, public rateLimit: RateLimit) {
    this.pQueue = new PQueue({
      concurrency: rateLimit.concurrency ?? 1,
      interval: rateLimit.interval,
      intervalCap: rateLimit.intervalCap,
      timeout: rateLimit.timeout ?? 30000,
    });
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return this.pQueue.add(fn, { throwOnTimeout: true });
  }
}

// Create specialized queues for different 1inch API endpoints
// Simplified settings - same config for all queues
const queueConfig = {
  intervalCap: 2,
  interval: 1200,
  concurrency: 1,
  timeout: 20000,
};

export const balanceQueue = new RequestQueue("1inch-balances", queueConfig);

export const priceQueue = new RequestQueue("1inch-prices", queueConfig);

export const metadataQueue = new RequestQueue("1inch-metadata", queueConfig);

export const historyQueue = new RequestQueue("1inch-history", queueConfig);
