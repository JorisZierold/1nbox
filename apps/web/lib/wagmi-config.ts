import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  arbitrum,
  avalanche,
  base,
  gnosis,
  linea,
  mainnet,
  optimism,
  polygon,
  sonic,
  unichain,
  zksync,
  bsc,
} from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [
  mainnet,
  unichain,
  optimism,
  arbitrum,
  zksync,
  base,
  linea,
  polygon,
  gnosis,
  sonic,
  avalanche,
  bsc,
] as [AppKitNetwork, ...AppKitNetwork[]];

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
