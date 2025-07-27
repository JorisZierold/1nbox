import { Button } from "@/components/ui/button";

interface Chain {
  name: string;
  icon: any;
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
          <chain.icon className="h-4 w-4" />
          {chain.name}
        </Button>
      ))}
    </div>
  );
}
