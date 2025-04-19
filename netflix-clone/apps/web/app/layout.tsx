import type { Metadata } from "next";
import { FC } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Netflix Clone",
  description: "A Netflix clone built with Next.js",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * RootLayout Component
 * 
 * This is the main layout component that wraps all pages in the application.
 * It includes:
 * - ClerkProvider: Provides authentication context to all child components
 * - HTML and body structure
 * 
 * @param {React.ReactNode} children - The child components/pages to be rendered
 */
const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="bg-black text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
