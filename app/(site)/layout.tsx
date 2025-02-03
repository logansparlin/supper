import type { Metadata } from "next";
import { draftMode } from "next/headers";
import localFont from "next/font/local";
import "./globals.css";

import { LayoutTransition } from "@/components/global/layout-transition";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity";
import { Header } from "@/components/global/header";
import { Footer } from "@/components/global/footer";
import { ReactLenis } from "lenis/react";
import { ThemeSwitcher } from "@/components/global/theme-switcher";

const timesNow = localFont({
  src: [
    {
      path: '../fonts/TimesNow-SemiBold.woff',
      weight: '600',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--font-times-now'
})

const grotesqueMT = localFont({
  src: [
    {
      path: '../fonts/GrotesqueMTStd.woff',
      weight: '400',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--font-grotesque-mt'
})

export const metadata: Metadata = {
  title: "Soft Union",
  description: "Soft Union is ...",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${timesNow.variable} ${grotesqueMT.variable} antialiased font-sans font-normal bg-off-white dark:bg-article-black text-black dark:text-off-white transition-colors duration-300 ease`}
      >
        <ThemeSwitcher />
        <Header />
        <SanityLive />
        <LayoutTransition>
          <ReactLenis root>
            {children}
            <Footer />
          </ReactLenis>
        </LayoutTransition>
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
