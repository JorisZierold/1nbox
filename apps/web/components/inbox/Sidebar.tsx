import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { categories } from "@/lib/data";
import { Logo } from "../logo";
import { WalletsSection } from "./WalletsSection";
import { ActionLauncher } from "./ActionLauncher";

export function Sidebar() {
  return (
    <aside className="w-full lg:w-72 bg-background/95 backdrop-blur-sm p-4 lg:p-6 lg:overflow-y-auto border-r border-border flex flex-col">
      <header className="mb-8 flex flex-col items-start gap-6">
        <Logo />
        <ActionLauncher />
      </header>
      <nav className="space-y-8 flex-1">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground px-3 mb-2">
            Categories
          </h2>
          <ul className="space-y-1">
            {categories.map((item) => (
              <li key={item.name}>
                <Link
                  href="#"
                  className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.selected
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.count && (
                    <Badge
                      variant={item.selected ? "default" : "secondary"}
                      className={
                        item.selected
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                    >
                      {item.count}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <WalletsSection />
      </nav>

      {/* Feedback & Social CTA */}
      <div className="mt-auto pt-4 border-t border-border space-y-2">
        <Link
          href="mailto:info@1nbox.xyz?subject=Feedback for 1nbox"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground text-xs"
          >
            <MessageCircle className="h-3 w-3" />
            Send Feedback
          </Button>
        </Link>

        <Link
          href="https://x.com/1nbox_xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground text-xs"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Follow on X
          </Button>
        </Link>
      </div>
    </aside>
  );
}
