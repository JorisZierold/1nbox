import PQueue from "p-queue";

interface RateLimit {
  intervalCap: number;
  interval: number;
  timeout?: number;
}

export class RequestQueue {
  pQueue: PQueue;

  constructor(public identifier: string, public rateLimit: RateLimit) {
    this.pQueue = new PQueue({
      concurrency: 1,
      interval: rateLimit.interval,
      intervalCap: rateLimit.intervalCap,
      timeout: rateLimit.timeout ?? 30000,
    });
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return this.pQueue.add(fn, { throwOnTimeout: true });
  }
}

// Create a singleton instance for 1inch API requests
export const oneInchQueue = new RequestQueue("1inch-api", {
  intervalCap: 4, // 1 request
  interval: 1100, // per 1.1 seconds (slightly over 1 RPS)
  timeout: 30000, // 30 second timeout
});
