"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import type { Action } from "@/types";
import {
  securityActions,
  utilityActions,
  allocationActions,
  promotionalAction,
} from "@/lib/data";
import { ActionSection } from "@/components/inbox/ActionSection";
import { PromotionalAction } from "@/components/inbox/PromotionalAction";
import { Sidebar } from "@/components/inbox/Sidebar";
import { TopHeader } from "@/components/inbox/TopHeader";
import { FilterControls } from "@/components/inbox/FilterControls";
import { ActionDetailsPanel } from "@/components/inbox/ActionDetailsPanel";
import { EmptyState } from "@/components/inbox/EmptyState";
import { BalancesCard } from "@/components/inbox/balance/BalancesCard";
import { useAppKitAccount } from "@reown/appkit/react";
import { TransactionHistory } from "@/components/history/TransactionHistory";
import { SplashScreen } from "@/components/intro/SplashScreen";
import { useWalletStore } from "@/hooks/store/wallet-store";

const allActions = [
  ...securityActions,
  ...utilityActions,
  ...allocationActions,
];
const uniqueChains = [
  { name: "All", icon: Layers },
  ...Array.from(new Set(allActions.map((a) => a.chainName))).map((name) => {
    return { name };
  }),
];

export default function InboxPage() {
  const [splashed, setSplashed] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [selectedChain, setSelectedChain] = useState("All");
  const { selectedWallet, setSelectedWallet } = useWalletStore();
  const { isConnected: isWalletConnected } = useAppKitAccount();

  const handleActionClick = (action: Action) => {
    setSelectedAction(action);
  };

  const handlePanelClose = () => {
    setSelectedAction(null);
  };

  const filterActions = (actions: Action[]) => {
    return actions.filter(
      (action) =>
        (selectedChain === "All" || action.chainName === selectedChain) &&
        (selectedWallet === "All Wallets" ||
          action.walletName === selectedWallet)
    );
  };

  const filteredSecurityActions = filterActions(securityActions);
  const filteredUtilityActions = filterActions(utilityActions);
  const filteredAllocationActions = filterActions(allocationActions);
  const hasActions =
    filteredSecurityActions.length > 0 ||
    filteredUtilityActions.length > 0 ||
    filteredAllocationActions.length > 0;

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
          <main className="flex-1">
            <TopHeader />

            {/* Balances Card */}
            {isWalletConnected && (
              <div className="px-6 pb-6">
                <BalancesCard />
                <div className="mb-8" />
                <TransactionHistory />
                <div className="mb-8" />
              </div>
            )}

            {/* Action Inbox */}
            <div className="px-6 pb-6">
              <div className="bg-muted/30 rounded-xl shadow-2xl border border-border backdrop-blur-sm">
                <div className="p-6">
                  <FilterControls
                    uniqueChains={uniqueChains}
                    selectedChain={selectedChain}
                    onChainSelect={setSelectedChain}
                  />

                  {/* Action Sections */}
                  {hasActions ? (
                    <div className="space-y-8">
                      <ActionSection
                        title="SECURITY"
                        category="security"
                        actions={filteredSecurityActions}
                        onActionClick={handleActionClick}
                      />
                      <ActionSection
                        title="UTILITY"
                        category="utility"
                        actions={filteredUtilityActions}
                        onActionClick={handleActionClick}
                      />
                      <ActionSection
                        title="ALLOCATION"
                        category="allocation"
                        actions={filteredAllocationActions}
                        onActionClick={handleActionClick}
                      />
                    </div>
                  ) : (
                    <EmptyState />
                  )}
                </div>
                {/* Promotional Action */}
                <div className="p-4 border-t border-border">
                  <PromotionalAction action={promotionalAction} />
                </div>
              </div>
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
