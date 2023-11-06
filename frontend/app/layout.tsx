"use client";

import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import { WagmiConfig } from 'wagmi';
import { Providers } from "./providers";import { SessionProvider, useSession } from "next-auth/react";
import { config } from "@/wagmi.config";


const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
        <SessionProvider>
        <WagmiConfig config={config}>
          <Header />
          </WagmiConfig>

          {children}
          
          </SessionProvider>
          
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}


