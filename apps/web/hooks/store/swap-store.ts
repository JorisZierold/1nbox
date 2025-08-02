import { create } from "zustand";
import { SwapToken, PendingSwap } from "@/types/swap";
import { mockPendingSwaps } from "@/app/mocks";

interface SwapState {
  isOpen: boolean;
  isMinimized: boolean;
  fromToken?: SwapToken;
  toToken?: SwapToken;
  amount: string;
  slippage: string;
  busy: boolean;
  pendingSwaps: PendingSwap[];
  openComposer: () => void;
  closeComposer: () => void;
  minimizeComposer: () => void;
  setFromToken: (token?: SwapToken) => void;
  setToToken: (token?: SwapToken) => void;
  setAmount: (amount: string) => void;
  setSlippage: (slippage: string) => void;
  setBusy: (busy: boolean) => void;
  addPendingSwap: (swap: PendingSwap) => void;
  updateSwapStatus: (swapId: string, status: PendingSwap["status"]) => void;
  removePendingSwap: (swapId: string) => void;
  resetForm: () => void;
}

export const useSwapStore = create<SwapState>((set, get) => ({
  // Initial state
  isOpen: false,
  isMinimized: false,
  fromToken: undefined,
  toToken: undefined,
  amount: "",
  slippage: "1",
  busy: false,
  pendingSwaps: [],

  // Actions
  openComposer: () => set({ isOpen: true, isMinimized: false }),
  closeComposer: () => set({ isOpen: false, isMinimized: false }),
  minimizeComposer: () => set((state) => ({ isMinimized: !state.isMinimized })),

  setFromToken: (token) => set({ fromToken: token }),
  setToToken: (token) => set({ toToken: token }),
  setAmount: (amount) => set({ amount }),
  setSlippage: (slippage) => set({ slippage }),
  setBusy: (busy) => set({ busy }),

  addPendingSwap: (swap) => {
    set((state) => ({
      pendingSwaps: [swap, ...state.pendingSwaps],
      isOpen: false, // Close composer after swap
      isMinimized: false,
    }));

    // Simulate status updates // TODO: remove this mocking
    setTimeout(() => {
      get().updateSwapStatus(swap.id, "confirmed");
    }, 8000);
  },

  updateSwapStatus: (swapId, status) =>
    set((state) => ({
      pendingSwaps: state.pendingSwaps.map((swap) =>
        swap.id === swapId ? { ...swap, status } : swap
      ),
    })),

  removePendingSwap: (swapId) =>
    set((state) => ({
      pendingSwaps: state.pendingSwaps.filter((swap) => swap.id !== swapId),
    })),

  resetForm: () =>
    set({
      fromToken: undefined,
      toToken: undefined,
      amount: "",
      slippage: "1",
      busy: false,
    }),
}));
