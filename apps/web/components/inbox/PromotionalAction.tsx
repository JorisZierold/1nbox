"use client";

import type { Action } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PromotionalAction({ action }: { action: Action }) {
  const {
    icon: Icon,
    iconBg,
    iconColor,
    title,
    description,
    tag,
    buttonText,
    link,
  } = action;

  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-gray-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className={`p-2 rounded-full ${iconBg}`}>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm text-white">{title}</h3>
              <Badge className="text-xs bg-gray-700 text-gray-300 font-medium border border-gray-600">
                {tag}
              </Badge>
            </div>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 shadow-lg shadow-blue-600/25"
          onClick={() => window.open(link, "_blank")}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
