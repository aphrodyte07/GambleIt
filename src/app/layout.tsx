import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GambleIt — AI Football Predictions",
  description: "Free AI-powered football match predictions for today's fixtures across Europe's top 5 leagues. Powered by Google Gemini.",
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 antialiased`}>
        {children}
      </body>
    </html>
  );
}
