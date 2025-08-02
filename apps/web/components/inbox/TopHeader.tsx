import { ThemeToggle } from "@/components/ui/theme-toggle";

export function TopHeader() {
  return (
    <div className="flex items-center justify-between h-16 w-full">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {/* TODO: add last updated time 
        <span>Last updated: 2 min ago</span>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        */}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </div>
  );
}
