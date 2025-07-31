# Transaction History Hooks Architecture

This directory contains a modular set of React hooks for handling cryptocurrency transaction history data fetching, processing, and state management. The hooks follow single-responsibility principle and can be composed together or used independently.

## Architecture Overview

```
useTransactionHistory (Main Hook - All-in-One)
├── useTransactionData (Transaction data with 5min cache)
└── useTransactionAlerts (Unseen transaction tracking)
```

## Hook Responsibilities

### `useTransactionData`

- **Purpose**: Fetches raw transaction data across all supported chains
- **Cache**: 5 minutes (transaction history doesn't change frequently)
- **Key Features**: Parallel fetching, only enabled when wallet connected, captures timestamps
- **Returns**: Transaction queries, loading states, supported chains, timestamps

### `useTransactionAlerts`

- **Purpose**: Tracks which transactions have been seen by the user using IndexedDB
- **Key Features**: Persistent storage, bulk operations, unseen count tracking
- **Returns**: Unseen transaction tracking, mark as seen functions, unseen count

### `useTransactionHistory` (Main Hook)

- **Purpose**: Complete transaction history solution - orchestrates data fetching, processes into usable format, handles UI state
- **Key Features**:
  - Data orchestration (fetching across all chains)
  - Data processing (raw data → processed transactions + chain statistics)
  - Error handling and loading states
  - Refresh functionality with cache invalidation
  - Debounced timestamps to prevent UI jumping
  - Chain filtering logic
- **Returns**: Everything components need in one hook

## Caching Strategy

| Data Type           | Cache Duration | Reasoning                                |
| ------------------- | -------------- | ---------------------------------------- |
| Transaction History | 5 minutes      | Transaction history is relatively static |
| Transaction Alerts  | Persistent     | IndexedDB storage for seen/unseen state  |
| Chain Statistics    | Real-time      | Computed from cached transaction data    |
| Timestamps          | 800ms debounce | Prevents UI jumping on rapid updates     |

## Error Handling

- **useTransactionData**: Single retry, returns empty data on persistent errors
- **useTransactionAlerts**: Comprehensive error logging, graceful degradation
- **useTransactionHistory**: Unified error state with stale-while-revalidate pattern
- **Components**: Show existing data during errors, multiple retry options

## Features

### Data Management

- **Parallel fetching** across all supported chains
- **Smart query invalidation** for refresh operations
- **Automatic background refetching** when data becomes stale
- **Combined loading states** that include both initial loads and refreshes

### User Experience

- **Chain filtering** with statistics
- **Transaction type filtering** with counts
- **Unseen transaction badges** and tracking
- **Last updated timestamps** with debouncing
- **Stale data indication** during errors
- **Multiple retry options** for failed operations

### Performance

- **TanStack Query integration** with optimized caching
- **Debounced processing** to prevent excessive re-renders
- **Memoized calculations** for chain statistics and filtering
- **Efficient IndexedDB operations** for alert tracking

## Future Enhancements

- Historical data aggregation and analytics
- Real-time transaction notifications via WebSocket
- Transaction categorization and tagging
- Export functionality for transaction data
- Advanced filtering and search capabilities
- Transaction performance metrics and insights
