"use client";

import { wagmiAdapter, projectId, networks } from "@/lib/wagmi-config";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { ThemeProvider } from "next-themes";
import {
  createQueryClient,
  createPersister,
  persistOptions,
  persistenceHandlers,
} from "@/lib/query-config";

// Create instances using centralized config
const queryClient = createQueryClient();
const persister = createPersister();

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
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          ...persistOptions,
        }}
        onSuccess={persistenceHandlers.onSuccess}
        onError={persistenceHandlers.onError}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          themes={["light", "dark", "ocean", "sunset", "rose"]}
          disableTransitionOnChange={false}
          storageKey="1nbox-theme"
        >
          {children}
        </ThemeProvider>
      </PersistQueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
