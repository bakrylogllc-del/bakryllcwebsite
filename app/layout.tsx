import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Lexend_Mega } from "next/font/google";
import { GlobalDotCursor } from "@/components/GlobalDotCursor";
import { GsapScrollBootstrap } from "@/components/GsapScrollBootstrap";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lexendMega = Lexend_Mega({
  variable: "--font-lexend-mega",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bakry LLC",
  description:
    "Bakry LLC designs, develops, and scales web products, mobile apps, SaaS platforms, and automation systems.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1230",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lexendMega.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden pb-[env(safe-area-inset-bottom)]">
        <GsapScrollBootstrap />
        <GlobalDotCursor />
        {children}
      </body>
    </html>
  );
}
