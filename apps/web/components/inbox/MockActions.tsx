"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import {
  securityActions,
  utilityActions,
  allocationActions,
  promotionalAction,
} from "@/lib/data";
import { ActionSection } from "@/components/inbox/ActionSection";
import { PromotionalAction } from "@/components/inbox/PromotionalAction";
import { FilterControls } from "@/components/inbox/FilterControls";

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

export const MockActions = () => {
  const [selectedChain, setSelectedChain] = useState("All");

  return (
    <div className="px-6 pb-6">
      <div className="bg-muted/30 rounded-xl shadow-2xl border border-border backdrop-blur-sm">
        <div className="p-6">
          <FilterControls
            uniqueChains={uniqueChains}
            selectedChain={selectedChain}
            onChainSelect={setSelectedChain}
          />

          {/* Action Sections */}

          <div className="space-y-8">
            <ActionSection
              title="SECURITY"
              category="security"
              actions={securityActions}
              onActionClick={() => {}}
            />
            <ActionSection
              title="UTILITY"
              category="utility"
              actions={utilityActions}
              onActionClick={() => {}}
            />
            <ActionSection
              title="ALLOCATION"
              category="allocation"
              actions={allocationActions}
              onActionClick={() => {}}
            />
          </div>
        </div>
        {/* Promotional Action */}
        <div className="p-4 border-t border-border">
          <PromotionalAction action={promotionalAction} />
        </div>
      </div>
    </div>
  );
};
