import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { categories, wallets } from "@/lib/data";

interface SidebarProps {
  isWalletConnected: boolean;
  selectedSidebarWallet: string;
  onWalletConnect: () => void;
  onWalletSelect: (walletName: string) => void;
}

export function Sidebar({
  isWalletConnected,
  selectedSidebarWallet,
  onWalletConnect,
  onWalletSelect,
}: SidebarProps) {
  return (
    <aside className="w-full lg:w-72 bg-black p-4 lg:p-6 lg:overflow-y-auto border-r border-gray-800/50">
      <header className="mb-8 flex items-center gap-3">
        <Image src="/logo-white.svg" alt="1nbox" width={100} height={100} />
      </header>
      <nav className="space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-gray-400 px-3 mb-2">
            Categories
          </h2>
          <ul className="space-y-1">
            {categories.map((item) => (
              <li key={item.name}>
                <Link
                  href="#"
                  className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.selected
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.count && (
                    <Badge
                      variant={item.selected ? "default" : "secondary"}
                      className={
                        item.name === "Security"
                          ? "bg-red-600 text-white border-red-500"
                          : item.selected
                          ? "bg-white/20 text-white border-white/30"
                          : "bg-gray-800 text-gray-300 border-gray-700"
                      }
                    >
                      {item.count}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-400 px-3 mb-2">
            Wallets
          </h2>
          <ul className="space-y-1">
            {isWalletConnected
              ? wallets.map((wallet) => (
                  <li key={wallet.name}>
                    <button
                      onClick={() => onWalletSelect(wallet.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedSidebarWallet === wallet.name
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                          : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <wallet.icon className="h-5 w-5" />
                        <span>{wallet.name}</span>
                      </div>
                      {wallet.address && (
                        <span className="text-xs text-gray-500">
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
                className="w-full justify-start gap-3 text-gray-300 p-3 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
                onClick={onWalletConnect}
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium text-sm">
                  {isWalletConnected ? "Add Wallet" : "Connect Wallet"}
                </span>
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
