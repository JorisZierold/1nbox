# Swap Hooks Architecture

This directory contains a modular set of React hooks for handling cryptocurrency token swapping via 1inch API. The hooks follow single-responsibility principle and provide a complete swap flow from token selection to transaction execution.

## Architecture Overview

```
Swap Flow (Complete Trading Pipeline)
├── useSwapTokens (Dynamic token discovery)
├── useQuote (Real-time price quotes)
├── useAllowance (Smart approval checking)
├── useApprove (Token approval execution)
└── useQuickSwap (Swap transaction execution)
```

## Hook Responsibilities

### `useSwapTokens`

- **Purpose**: Dynamic token discovery combining 1inch metadata with user balances
- **Data Sources**: Token metadata + wallet balances
- **Key Features**: Balance-aware sorting, popular token defaults, cross-chain support
- **Returns**: Available tokens, default selections, loading states

### `useQuote`

- **Purpose**: Real-time swap quotes from 1inch Pathfinder
- **Cache**: No cache (real-time pricing)
- **Key Features**: Conditional fetching, gas estimation, route optimization
- **Returns**: Quote data, loading states, error handling

### `useAllowance`

- **Purpose**: Token approval checking with smart polling
- **Polling**: 5-second intervals when approval needed, stops when sufficient
- **Key Features**: Amount-aware polling, wallet validation, efficient caching
- **Returns**: Current allowance, loading states, refresh function

### `useApprove`

- **Purpose**: Token approval transaction execution
- **Transaction**: Uses wagmi `sendTransactionAsync` for proper hash return
- **Key Features**: Wallet connection validation, amount-specific approvals
- **Returns**: Approval function, connection status

### `useQuickSwap`

- **Purpose**: Swap transaction execution via 1inch
- **Transaction**: Complete swap flow with transaction hash return
- **Key Features**: Parameter validation, slippage control, error handling
- **Returns**: Swap execution function, connection status

## Polling Strategy

| Hook          | Polling Behavior                               | Reasoning                         |
| ------------- | ---------------------------------------------- | --------------------------------- |
| useSwapTokens | Static after load                              | Metadata rarely changes           |
| useQuote      | No polling (manual refresh)                    | Real-time quotes on user action   |
| useAllowance  | 5s when approval needed, stops when sufficient | Efficient approval state tracking |
| useApprove    | One-time execution                             | Transaction-based                 |
| useQuickSwap  | One-time execution                             | Transaction-based                 |

## Error Handling

- **useSwapTokens**: Graceful fallback to empty arrays, console warnings
- **useQuote**: React Query error states, conditional fetching prevents invalid calls
- **useAllowance**: Validation errors (400) don't retry, network errors retry twice
- **useApprove**: Wallet connection validation, transaction error propagation
- **useQuickSwap**: Parameter validation, transaction error handling with user feedback

## Integration Example

```typescript
// Complete swap flow integration
const { tokens, defaultTokens } = useSwapTokens(chainId);
const { quote } = useQuote(quoteParams, enabled);
const { allowance } = useAllowance(chainId, token, wallet, enabled, amount);
const { approveExact } = useApprove();
const { buildAndSendSwap } = useQuickSwap();

// Usage in component
if (needsApproval) {
  await approveExact({ chainId, tokenAddress, amount });
} else {
  await buildAndSendSwap(swapParams);
}
```

## API Integration

All hooks use server-side API routes that proxy to 1inch API:

- `/api/oneinch/quote` - Price quotes
- `/api/oneinch/approve/allowance` - Allowance checking
- `/api/oneinch/approve/transaction` - Approval transactions
- `/api/oneinch/swap` - Swap transactions

This ensures API key security and provides consistent error handling across the application.
