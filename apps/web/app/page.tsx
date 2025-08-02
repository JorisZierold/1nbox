"use client";

import { useState } from "react";
import type { Action } from "@/types";
import { Sidebar } from "@/components/inbox/Sidebar";
import { TopHeader } from "@/components/inbox/TopHeader";
import { ActionDetailsPanel } from "@/components/inbox/ActionDetailsPanel";
import { BalancesCard } from "@/components/inbox/balance/BalancesCard";
import { useAppKitAccount } from "@reown/appkit/react";
import { TransactionHistory } from "@/components/history/TransactionHistory";
import { SplashScreen } from "@/components/intro/SplashScreen";
import { useSwapStore } from "@/hooks/store/swap-store";
import { SwapComposer } from "@/components/swap/SwapComposer";
import { PendingSwapCard } from "@/components/swap/PendingSwapCard";

export default function InboxPage() {
  const [splashed, setSplashed] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const { isConnected: isWalletConnected, address } = useAppKitAccount();

  const { isOpen: isSwapComposerOpen, pendingSwaps } = useSwapStore();

  const handlePanelClose = () => {
    setSelectedAction(null);
  };

  if (!splashed || !isWalletConnected) {
    return <SplashScreen setSplashed={setSplashed} />;
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="flex flex-col lg:flex-row lg:h-screen">
        <Sidebar />

        {/* Main scrollable area */}
        <div className="flex-1 flex flex-col lg:overflow-y-auto bg-background">
          {/* Main Content */}
          <main className="flex flex-col px-6">
            {/* Header with Action Launcher */}
            <div className="flex items-center justify-between py-1">
              <TopHeader />
            </div>

            {/* Inbox Content */}
            <div className="space-y-8">
              {/* Swap Composer */}
              {isSwapComposerOpen && address && <SwapComposer />}

              {/* Pending Swaps */}
              {pendingSwaps.length > 0 && (
                <div className="space-y-2">
                  {pendingSwaps.map((swap) => (
                    <PendingSwapCard key={swap.id} swap={swap} />
                  ))}
                </div>
              )}

              {/* Balances Card */}
              {isWalletConnected && (
                <div className="space-y-8">
                  <BalancesCard />
                  <TransactionHistory />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <ActionDetailsPanel
        selectedAction={selectedAction}
        onClose={handlePanelClose}
      />
    </div>
  );
}
