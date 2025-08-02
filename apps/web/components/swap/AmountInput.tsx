"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forwardRef, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface AmountInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  balance?: string;
  symbol?: string;
  error?: string;
  className?: string;
  debounceMs?: number;
}

export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      value = "",
      onChange,
      onBlur,
      balance,
      symbol,
      error,
      className,
      debounceMs = 500,
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState(value);
    const debouncedValue = useDebounce(localValue, debounceMs);
    const isMaxClick = useRef(false);

    // Update parent when debounced value changes (but not for Max clicks)
    useEffect(() => {
      if (onChange && debouncedValue !== value && !isMaxClick.current) {
        onChange(debouncedValue);
      }
      isMaxClick.current = false;
    }, [debouncedValue, onChange, value]);

    // Sync with external changes
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleMaxClick = () => {
      if (balance && onChange) {
        isMaxClick.current = true; // Set flag to bypass debounce
        setLocalValue(balance);
        onChange(balance); // Immediate for Max button
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Allow empty string
      if (inputValue === "") {
        setLocalValue(inputValue);
        return;
      }

      // Only allow valid decimal numbers
      if (/^\d*\.?\d*$/.test(inputValue)) {
        setLocalValue(inputValue);
      }
    };

    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Amount</label>

        {/* Main Input */}
        <div className="relative">
          <Input
            ref={ref}
            type="text"
            inputMode="decimal"
            placeholder="0.0"
            value={localValue}
            onChange={handleInputChange}
            onBlur={onBlur}
            className={cn(
              "!text-2xl font-semibold text-primary border-2 focus:border-primary h-16 px-4 bg-muted/20",
              className
            )}
            {...props}
          />
        </div>

        {/* Balance and Max Button Row */}
        {balance && (
          <div className="flex items-center justify-start gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Balance</span>
              <span className="font-medium text-foreground">
                {balance}
                {symbol && ` ${symbol}`}
              </span>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleMaxClick}
              disabled={!balance}
              className="h-7 px-3 text-xs font-medium bg-primary/20 text-primary"
            >
              Max
            </Button>
          </div>
        )}
      </div>
    );
  }
);

AmountInput.displayName = "AmountInput";
