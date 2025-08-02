import { z } from "zod";

export const swapFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Amount must be greater than 0")
    .refine((val) => {
      return /^\d*\.?\d*$/.test(val);
    }, "Invalid number format"),

  fromToken: z
    .object({
      address: z.string(),
      symbol: z.string(),
      name: z.string(),
      decimals: z.number(),
      logoURI: z.string().optional(),
      hasBalance: z.boolean().optional(),
      balance: z.string().optional(),
    })
    .nullable()
    .refine((token) => token !== null, "Please select a token to swap from"),

  toToken: z
    .object({
      address: z.string(),
      symbol: z.string(),
      name: z.string(),
      decimals: z.number(),
      logoURI: z.string().optional(),
      hasBalance: z.boolean().optional(),
      balance: z.string().optional(),
    })
    .nullable()
    .refine((token) => token !== null, "Please select a token to swap to"),

  slippage: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0.1 && num <= 50;
  }, "Slippage must be between 0.1% and 50%"),
});

export type SwapFormData = z.infer<typeof swapFormSchema>;
