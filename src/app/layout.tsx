import "./globals.css";

import { Inter as FontSans } from "next/font/google";
import { type Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/lib/providers/theme-state";
import { AppStateProvider } from "@/lib/providers/app-state";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const title = "Shop-It";
const description =
  "A simple prototype for fashion image recognition, and shopping reccomendations.";

export const metadata: Metadata = {
  title,
  description,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppStateProvider>
            <Header />
            {children}
            <Footer />
            <Toaster richColors closeButton />
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
