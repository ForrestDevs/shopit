import React from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";

export async function Header() {
  return (
    <header className="fixed w-full p-1 md:p-2 flex justify-between items-center z-10 backdrop-blur md:backdrop-blur-none bg-background/80 md:bg-transparent">
      <div>
        <a href="/">
          <ShoppingCartIcon className={cn("w-5 h-5")} />
          <span className="sr-only">Shop-It</span>
        </a>
      </div>
      <h1 className="text-lg font-bold">Shop-It</h1>
      <div className="flex gap-0.5">
        <ModeToggle />
      </div>
    </header>
  );
}
