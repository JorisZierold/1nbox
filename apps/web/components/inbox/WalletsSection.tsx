import { Button } from "@/components/ui/button";
import { Plus, WalletIcon, LayoutGrid } from "lucide-react";
import {
  useAppKit,
  useAppKitAccount,
  useWalletInfo,
} from "@reown/appkit/react";
import { useWalletStore } from "@/lib/stores/wallet-store";

export function WalletsSection() {
  const { open } = useAppKit();
  const { address, allAccounts } = useAppKitAccount();
  const { walletInfo } = useWalletInfo();
  const { selectedWallet, setSelectedWallet } = useWalletStore();

  const walletIcon = walletInfo?.icon ? (
    <img
      src={walletInfo.icon}
      alt="Wallet Icon"
      width={20}
      height={20}
      className="h-5 w-5"
    />
  ) : (
    <WalletIcon className="h-5 w-5" />
  );

  const wallets =
    allAccounts.length > 0
      ? [
          {
            name: "All Wallets",
            icon: <LayoutGrid className="h-5 w-5" />,
            address: "",
            selected: false,
          },
          ...allAccounts.map((account) => ({
            name:
              account.address.slice(0, 4) + "..." + account.address.slice(-4),
            icon:
              address === account.address ? (
                walletIcon
              ) : (
                <WalletIcon className="h-5 w-5" />
              ),
            address: "",
            selected: address === account.address,
          })),
        ]
      : [];

  return (
    <div>
      <h2 className="text-sm font-semibold text-muted-foreground px-3 mb-2">
        Wallets
      </h2>
      <ul className="space-y-1">
        {address
          ? wallets.map((wallet) => (
              <li key={wallet.name}>
                <button
                  onClick={() => setSelectedWallet(wallet.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedWallet === wallet.name
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {wallet.icon}
                    <span>{wallet.name}</span>
                  </div>
                  {wallet.address && (
                    <span className="text-xs text-muted-foreground/70">
                      {wallet.address}
                    </span>
                  )}
                </button>
              </li>
            ))
          : null}
        <li>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground p-3 hover:bg-muted hover:text-foreground transition-all duration-200"
            onClick={() => open({ view: "Connect" })}
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium text-sm">
              {address ? "Add Wallet" : "Connect Wallet"}
            </span>
          </Button>
        </li>
      </ul>
    </div>
  );
}
