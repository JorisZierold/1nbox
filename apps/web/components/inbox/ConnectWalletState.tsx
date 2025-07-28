import { Button } from "@/components/ui/button";
import { useAppKit } from "@reown/appkit/react";
import { WalletCards } from "lucide-react";

export function ConnectWalletState() {
  const { open } = useAppKit();
  return (
    <div className="bg-gray-900/50 rounded-xl shadow-2xl border border-gray-800/50 backdrop-blur-sm p-6 text-center flex flex-col items-center justify-center h-full min-h-[500px]">
      <div className="bg-blue-600/20 p-5 rounded-full mb-6 border border-blue-500/30 shadow-lg shadow-blue-600/25">
        <WalletCards className="h-12 w-12 text-blue-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-white">
        Your inbox is waiting
      </h2>
      <p className="text-gray-400 mb-8 max-w-xs">
        Connect your wallet to see personalized actions and security alerts.
      </p>
      <Button
        onClick={() => open({ view: "Connect" })}
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition-all duration-200"
      >
        Connect Wallet
      </Button>
    </div>
  );
}
