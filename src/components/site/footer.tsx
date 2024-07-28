import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export async function Footer() {
  return (
    <footer className="w-fit p-1 md:p-2 fixed bottom-0 right-0">
      <div className="flex justify-end">
        <Link
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "text-muted-foreground/50"
          )}
          href="https://twitter.com/forrestdevs"
          target="_blank"
        >
          <TwitterLogoIcon className="w-4 h-4" />{" "}
        </Link>
        <Link
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "text-muted-foreground/50"
          )}
          href="https://github.com/forrestdevs"
          target="_blank"
        >
          <GitHubLogoIcon className="w-4 h-4" />{" "}
        </Link>
      </div>
    </footer>
  );
}
