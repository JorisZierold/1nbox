import axios, { AxiosInstance } from "axios";
import {
  balanceQueue,
  priceQueue,
  metadataQueue,
  historyQueue,
} from "../request-queue";
import type {
  OneInchTokenMetadata,
  HistoryResponse,
  BalanceResponse,
  PriceResponse,
} from "./types";
import { ChainId } from "../wagmi-config";

/**
 * OneInch API service for fetching blockchain data
 * Routes requests through internal API endpoints for rate limiting and caching
 */
class OneInchApiService {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: "/api",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    this.httpClient.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
      }
    );
  }

  async getWalletBalances(
    chainId: ChainId,
    address: string
  ): Promise<BalanceResponse> {
    return balanceQueue.add(async () => {
      try {
        console.log(`Fetching balances for ${address} on chain ${chainId}`);

        const response = await this.httpClient.get(
          `/balances/${chainId}/${address}`
        );

        console.log("Balance response:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Balance fetch error:", error);
        throw new Error(
          `Failed to fetch balances: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    });
  }

  async getTokenPrices(
    chainId: ChainId,
    tokens: string[]
  ): Promise<PriceResponse> {
    return priceQueue.add(async () => {
      try {
        // Always return empty object if no tokens provided
        if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
          console.log(
            `No tokens provided for chain ${chainId}, returning empty prices`
          );
          return {};
        }

        console.log(`Fetching prices for tokens on chain ${chainId}:`, tokens);

        const response = await this.httpClient.post(`/prices/${chainId}`, {
          params: {
            tokens: tokens.filter(
              (token) => token && typeof token === "string"
            ), // Clean tokens
            currency: "USD",
          },
        });

        console.log("Price response:", response.data);
        return response.data || {};
      } catch (error: any) {
        console.error("Price fetch error:", error);

        // For 4xx errors, return empty object instead of throwing
        if (error.response?.status >= 400 && error.response?.status < 500) {
          console.warn(
            `Client error fetching prices for chain ${chainId}, returning empty prices`
          );
          return {};
        }

        throw new Error(
          `Failed to fetch prices: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    });
  }

  async getTokenMetadata(chainId: ChainId): Promise<OneInchTokenMetadata> {
    return metadataQueue.add(async () => {
      try {
        console.log(`Fetching metadata for chain ${chainId}`);

        const response = await this.httpClient.get(`/token/${chainId}`);
        return response.data as OneInchTokenMetadata;
      } catch (error: any) {
        console.error("Token metadata error:", error);
        throw new Error(
          `Failed to fetch metadata: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    });
  }

  async getTransactionHistory(
    address: string,
    chainId?: ChainId,
    limit?: number
  ): Promise<HistoryResponse> {
    return historyQueue.add(async () => {
      try {
        console.log(`Fetching history for ${address}`);

        const params = new URLSearchParams();
        if (chainId) params.append("chainId", chainId.toString());
        if (limit) params.append("limit", limit.toString());

        const response = await this.httpClient.get(
          `/history/${address}?${params.toString()}`
        );

        console.log("History response:", response.data);
        return response.data as HistoryResponse;
      } catch (error: any) {
        console.error("History fetch error:", error);
        throw new Error(
          `Failed to fetch transaction history: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    });
  }
}

export default new OneInchApiService();
