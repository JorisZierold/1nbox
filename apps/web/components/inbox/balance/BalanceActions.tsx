import { Button } from "@/components/ui/button";
import { ChainBalance, PortfolioData } from "@/lib/portfolio";
import { Coins, Zap, TrendingUp } from "lucide-react";

interface BalanceActionsProps {
  portfolioData: PortfolioData;
}

export const BalanceActions = ({ portfolioData }: BalanceActionsProps) => {
  // Calculate contextual actions
  const hasDust = portfolioData.chainBalances.some((chain: ChainBalance) =>
    chain.anomalies.includes("dust")
  );
  const hasLowGas = portfolioData.chainBalances.some((chain: ChainBalance) =>
    chain.anomalies.includes("gas_low")
  );
  const hasConcentration = portfolioData.chainBalances.some(
    (chain: ChainBalance) => chain.anomalies.includes("concentration")
  );

  const handleActionClickFromCard = (action: string) => {
    // TODO: Open specific action inspector
    console.log("Action clicked from card:", action);
  };

  return null;

  // TODO: Implement actions

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {hasDust && (
        <Button
          variant="outline"
          size="sm"
          className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50"
          onClick={() => handleActionClickFromCard("sweep_dust")}
        >
          <Coins className="h-3 w-3 mr-1" />
          Sweep Dust
        </Button>
      )}
      {hasLowGas && (
        <Button
          variant="outline"
          size="sm"
          className="bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/50"
          onClick={() => handleActionClickFromCard("top_up_gas")}
        >
          <Zap className="h-3 w-3 mr-1" />
          Top Up Gas
        </Button>
      )}
      {hasConcentration && (
        <Button
          variant="outline"
          size="sm"
          className="bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/50"
          onClick={() => handleActionClickFromCard("rebalance")}
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Review Rebalance
        </Button>
      )}
    </div>
  );
};
