"use client";

import * as React from "react";
import {
  Moon,
  Sun,
  Waves,
  Sunset,
  Palette,
  PaintBucket,
  Heart,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-8 w-8">
        <Palette className="h-4 w-4 text-foreground" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const themes = [
    { name: "dark", label: "Dark", icon: Moon },
    { name: "light", label: "Light", icon: Sun },
    { name: "ocean", label: "Ocean", icon: Waves },
    { name: "sunset", label: "Sunset", icon: Sunset },
    { name: "rose", label: "Rose", icon: Heart },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <PaintBucket className="h-4 w-4 text-foreground" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map(({ name, label, icon: Icon }) => (
          <DropdownMenuItem
            key={name}
            onClick={() => setTheme(name)}
            className={theme === name ? "bg-accent" : ""}
          >
            <Icon className="mr-2 h-4 w-4" />
            {label}
            {theme === name && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
