"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";

interface SlippageSelectorProps {
  control: any;
  error?: string;
}

export function SlippageSelector({ control, error }: SlippageSelectorProps) {
  const presetOptions = [
    { label: "0.1%", value: "0.1" },
    { label: "0.5%", value: "0.5" },
    { label: "1%", value: "1" },
  ];

  return (
    <Controller
      name="slippage"
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">
              Slippage tolerance
            </span>
          </div>

          {/* Slippage Options */}
          <div className="flex gap-2">
            {presetOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={field.value === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => field.onChange(option.value)}
                className="h-7 px-3 text-xs"
              >
                {option.label}
              </Button>
            ))}

            {/* Custom Input */}
            <div className="flex items-center gap-1">
              <Input
                type="number"
                className="w-12 h-7 text-xs px-1"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                placeholder="0.1"
                min="0"
                max="50"
                step="0.1"
              />
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      )}
    />
  );
}
