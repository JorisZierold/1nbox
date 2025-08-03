import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import { Analytics } from "@vercel/analytics/next";

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
        <ContextProvider cookies={cookies}>
          {children}
          <Analytics />
        </ContextProvider>
      </body>
    </html>
  );
}
