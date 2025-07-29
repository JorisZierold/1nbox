import { Button } from "@/components/ui/button";
import { getChainIcon } from "@/lib/chains";

interface Chain {
  name: string;
}

interface FilterControlsProps {
  uniqueChains: Chain[];
  selectedChain: string;
  onChainSelect: (chainName: string) => void;
}

export function FilterControls({
  uniqueChains,
  selectedChain,
  onChainSelect,
}: FilterControlsProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm font-semibold text-gray-300">
        Filter by chain:
      </span>
      {uniqueChains.map((chain) => (
        <Button
          key={chain.name}
          variant={selectedChain === chain.name ? "default" : "outline"}
          size="sm"
          onClick={() => onChainSelect(chain.name)}
          className={`flex items-center gap-2 transition-all duration-200 ${
            selectedChain === chain.name
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25"
              : `text-gray-300 bg-gray-900/50 border-gray-700 hover:bg-gray-800/50 hover:text-white`
          }`}
        >
          {chain.name !== "All" && (
            <img
              src={getChainIcon(chain.name)}
              alt={chain.name}
              className="w-4 h-4 object-contain flex-shrink-0"
              title={chain.name}
            />
          )}
          {chain.name}
        </Button>
      ))}
    </div>
  );
}
