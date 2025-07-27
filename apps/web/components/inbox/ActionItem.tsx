"use client";

import type { Action } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Wallet } from "lucide-react";

interface ActionItemProps {
  action: Action;
  onClick: () => void;
}

export function ActionItem({ action, onClick }: ActionItemProps) {
  const {
    icon: Icon,
    iconBg,
    iconColor,
    title,
    tag,
    tagType,
    buttonText,
    buttonVariant,
    description,
    walletName,
    chainName,
    chainIcon: ChainIcon,
    chainColor,
  } = action;

  const tagStyles = {
    risk: "bg-red-600 text-white border-red-500",
    attention: "bg-yellow-600 text-white border-yellow-500",
    opportunity: "bg-green-600 text-white border-green-500",
    sponsored: "bg-blue-600 text-white border-blue-500",
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800/50 transition-all duration-200 group first:rounded-t-lg last:rounded-b-lg border border-transparent hover:border-gray-700/50`}
    >
      <div className="flex items-start gap-4 flex-1">
        <div className={`mt-1 p-3 rounded-full ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base text-white">{title}</h3>
          <p className="text-sm text-gray-300">{description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <Wallet className="h-3 w-3" />
              <span>{walletName}</span>
            </div>
            <div
              className={`flex items-center gap-1.5 font-medium ${chainColor}`}
            >
              <ChainIcon className="h-3 w-3" />
              <span>{chainName}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 pl-4">
        {tag && (
          <Badge className={`font-semibold ${tagType && tagStyles[tagType]}`}>
            {tag}
          </Badge>
        )}
        {buttonText ? (
          <Button
            size="sm"
            className={
              buttonVariant === "primary"
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
                : "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
            }
            onClick={(e) => e.stopPropagation()}
          >
            {buttonText}
          </Button>
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
        )}
      </div>
    </div>
  );
}
