"use client";

import type { Action } from "@/lib/types";
import { PieChart, Shield, Zap } from "lucide-react";
import { ActionItem } from "./ActionItem";

interface ActionSectionProps {
  title: string;
  category: "security" | "utility" | "allocation";
  actions: Action[];
  onActionClick: (action: Action) => void;
}

export function ActionSection({
  title,
  category,
  actions,
  onActionClick,
}: ActionSectionProps) {
  if (actions.length === 0) {
    return null;
  }

  const categoryIcons = {
    security: <Shield className="h-4 w-4" />,
    utility: <Zap className="h-4 w-4" />,
    allocation: <PieChart className="h-4 w-4" />,
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-gray-300 tracking-wider flex items-center gap-2">
        {categoryIcons[category]} {title}
      </h4>
      <div className="border border-gray-800/50 rounded-lg divide-y divide-gray-800/50 bg-gray-900/30">
        {actions.map((action, index) => (
          <ActionItem
            key={index}
            action={action}
            onClick={() => onActionClick(action)}
          />
        ))}
      </div>
    </div>
  );
}
