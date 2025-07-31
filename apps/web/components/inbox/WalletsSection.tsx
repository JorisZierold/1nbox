import { Button } from "@/components/ui/button";
import { Plus, WalletIcon, LayoutGrid, LogOut } from "lucide-react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { useConnections, useDisconnect } from "wagmi";

export function WalletsSection() {
  const { open } = useAppKit();
  const { address } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const connections = useConnections();

  const { selectedWallet, setSelectedWallet } = useWalletStore();

  const wallets =
    connections.length > 0
      ? [
          {
            name: "All Wallets",
            icon: <LayoutGrid className="h-5 w-5" />,
            address: "",
            selected: false,
            isActive: false,
            connector: null,
          },
          ...connections.map((connection) => ({
            name:
              connection.accounts[0].slice(0, 4) +
              "..." +
              connection.accounts[0].slice(-4),
            icon: connection.connector.icon ? (
              <img
                src={connection.connector.icon}
                alt="Wallet Icon"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            ) : (
              <WalletIcon className="h-5 w-5" />
            ),
            address: connection.accounts[0],
            selected: address === connection.accounts[0],
            isActive: address === connection.accounts[0],
            connector: connection.connector,
          })),
        ]
      : [];

  const handleDisconnectWallet = (connector: any) => {
    disconnect({ connector });
    setSelectedWallet("All Wallets");
  };

  const handleWalletSwitch = (walletName: string) => {
    setSelectedWallet(walletName);
  };

  return (
    <div>
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          {connections.length > 1 ? "Switch Wallet" : "Wallets"}
        </h2>
        {connections.length > 1 && (
          <span className="text-xs text-muted-foreground">
            {connections.length} connected
          </span>
        )}
      </div>

      <ul className="space-y-1">
        {address
          ? wallets.map((wallet) => (
              <li key={wallet.name}>
                <div
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedWallet === wallet.name
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <button
                    onClick={() => handleWalletSwitch(wallet.name)}
                    className="flex items-center gap-3 flex-1"
                  >
                    {wallet.icon}
                    <div className="flex flex-col items-start">
                      <span>{wallet.name}</span>
                      {wallet.isActive && (
                        <span className="text-xs opacity-70">Active</span>
                      )}
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    {wallet.connector && (
                      <button
                        onClick={() => handleDisconnectWallet(wallet.connector)}
                        className="p-1 rounded hover:bg-muted transition-colors group"
                        title={`Disconnect ${wallet.name}`}
                      >
                        <LogOut className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                      </button>
                    )}
                  </div>
                </div>
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
