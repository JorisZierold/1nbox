# Token Hooks Architecture

This directory contains a modular set of React hooks for handling cryptocurrency token data fetching, processing, and state management. The hooks are designed with single-responsibility principle and can be composed together or used independently.

## Architecture Overview

```
usePortfolio (Main Hook - All-in-One)
├── useTokenMetadata (Token metadata with 24h cache)
├── useTokenBalances (Wallet balances with 60s cache)
└── useTokenPrices (Token prices with 10m cache)
```

## Hook Responsibilities

### `useTokenMetadata`

- **Purpose**: Fetches token metadata (symbol, name, decimals, logo) for all supported chains
- **Cache**: 24 hours (metadata rarely changes)
- **Key Features**: Always enabled, pre-fetches for all chains
- **Returns**: `metadataQueries`, loading states, supported chains

### `useTokenBalances`

- **Purpose**: Fetches wallet balances for all supported chains
- **Cache**: 60 seconds (balances change frequently)
- **Key Features**: Only enabled when wallet connected, determines chains with balances, captures timestamps
- **Returns**: Balance queries, chains with balances, loading states, timestamps

### `useTokenPrices`

- **Purpose**: Fetches token prices for chains that have balances
- **Cache**: 10 minutes (prices change moderately)
- **Key Features**: Smart dependency on balance data, only fetches needed prices, captures timestamps
- **Returns**: Price queries, loading states, timestamps

### `usePortfolio` (Main Hook)

- **Purpose**: Complete portfolio solution - orchestrates data fetching, processes into portfolio format, handles UI state
- **Key Features**:
  - Data orchestration (metadata, balances, prices)
  - Data processing (raw data → portfolio format)
  - UI state management (filtering, chain selection)
  - Error handling and loading states
  - Refresh functionality with cache invalidation
  - Debounced timestamps to prevent UI jumping
- **Returns**: Everything components need in one hook

## Caching Strategy

| Data Type  | Cache Duration | Reasoning                            |
| ---------- | -------------- | ------------------------------------ |
| Metadata   | 24 hours       | Token metadata rarely changes        |
| Balances   | 60 seconds     | Balances change frequently           |
| Prices     | 10 minutes     | Prices change moderately             |
| Portfolio  | Real-time      | Computed from cached data            |
| Timestamps | 800ms debounce | Prevents UI jumping on rapid updates |

## Error Handling

- **useTokenMetadata**: Retries twice, falls back to defaults
- **useTokenBalances**: Single retry, graceful degradation
- **useTokenPrices**: Returns empty prices for client errors
- **usePortfolio**: Unified error state with timeout protection, comprehensive error reporting
