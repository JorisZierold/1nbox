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
          className="bg-info/10 border-info/30 text-info hover:bg-info/20 hover:border-info/50"
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
          className="bg-warning/10 border-warning/30 text-warning hover:bg-warning/20 hover:border-warning/50"
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
          className="bg-success/10 border-success/30 text-success hover:bg-success/20 hover:border-success/50"
          onClick={() => handleActionClickFromCard("rebalance")}
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Rebalance
        </Button>
      )}
    </div>
  );
};
