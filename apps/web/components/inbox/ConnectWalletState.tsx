import { Button } from "@/components/ui/button";
import { useAppKit } from "@reown/appkit/react";
import { WalletCards } from "lucide-react";

export function ConnectWalletState() {
  const { open } = useAppKit();
  return (
    <div className="bg-card rounded-xl border border-border backdrop-blur-sm p-6 text-center flex flex-col items-center justify-center h-full min-h-[500px]">
      <div className="bg-primary/20 p-5 rounded-full mb-6 border border-primary/30 shadow-lg shadow-primary/25">
        <WalletCards className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Your inbox is waiting
      </h2>
      <p className="text-muted-foreground mb-8 max-w-xs">
        Connect your wallet to see personalized DeFi action inbox.
      </p>
      <Button
        onClick={() => open({ view: "Connect" })}
        size="lg"
        className="shadow-lg shadow-primary/25 transition-all duration-200"
      >
        Connect Wallet
      </Button>
    </div>
  );
}
