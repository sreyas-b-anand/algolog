import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import Providers from "../utils/provider";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "AlgoLog",
  description: "Your competitive programming companion",
};

const jostSans = Jost({
  variable: "--font-jost-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${jostSans.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
