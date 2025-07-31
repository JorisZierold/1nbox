import { create } from "zustand";

interface WalletStore {
  selectedWallet: string;
  setSelectedWallet: (wallet: string) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  selectedWallet: "All Wallets",
  setSelectedWallet: (wallet) => set({ selectedWallet: wallet }),
}));
