import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { headers } from "next/headers";
import ContextProvider from "@/context";

export const metadata: Metadata = {
  title: "1nbox",
  description: "1nbox DeFi action inbox",
};

const inter = Inter({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get("cookie");

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ContextProvider cookies={cookies}>{children}</ContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
