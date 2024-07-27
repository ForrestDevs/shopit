import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/lib/trpc/react";

export const metadata: Metadata = {
  title: "Shop-It",
  description: "A simple prototype for fashion image recognition, and shopping reccomendations.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
