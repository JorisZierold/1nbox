"use client";

import { wagmiAdapter, projectId, networks } from "@/lib/wagmi-config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

const queryClient = new QueryClient();

const metadata = {
  name: "1nbox",
  description: "1nbox DeFi action inbox",
  url: "https://1nbox.xyz",
  icons: ["https://1nbox.xyz/favicon.ico"],
};

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId: projectId || "",
  networks,
  metadata,
  themeMode: "light",
  features: {
    analytics: false,
    swaps: false,
    onramp: false,
    email: false,
    socials: false,
    history: false,
    allWallets: false,
    send: false,
  },
  themeVariables: {
    "--w3m-accent": "#000000",
  },
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
