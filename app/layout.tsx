import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import CardNav from "@/components/CardNav";
import React from "react";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

const outfit = Outfit( { subsets: [ 'latin' ], variable: '--font-sans' } );

export const metadata: Metadata = {
  title: "Media Tracker",
  description: "A media tracker app for anime, manga, and games.",
  icons: {
    icon: '/icon.png',
  },
};

const items = [
  {
    label: 'Anime',
    bgImage: '/anime-bg.jpeg',
    links: [ { label: 'View Anime', href: '/media/anime' }, { label: 'Search Anime', href: '/anime-search' } ],
  },
  {
    label: 'Manga',
    bgImage: '/manga-bg.jpg',
    links: [ { label: 'View Manga', href: '/media/manga' }, { label: 'Search Manga', href: '/manga-search' } ],
  },
  {
    label: 'Games',
    bgImage: '/games-bg.jpg',
    links: [ { label: 'View Games', href: '/media/game' }, { label: 'Search Games', href: '/games-search' } ],
  }
];

export default function RootLayout( {
                                      children,
                                    }: Readonly<{
  children: React.ReactNode;
}> ) {
  return (
    <html lang="en" className={ cn( outfit.className, 'bg-background text-foreground' ) } suppressHydrationWarning>
    <body className="antialiased relative min-h-screen">
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
    <CardNav
      items={ items }
      logo={ '/icon.png' }
      logoAlt={ 'Logo' }
      baseColor={ '#1c2e38' }
      menuColor={ '#f3e3ea' }
      buttonBgColor={ '#e4a2b1' }
      buttonTextColor={ '#12242e' }
      ease={ 'back.out' }
    />
    <main className="pt-24 px-4 md:px-10 lg:pt-24 w-full pb-10">
      { children }
      <Toaster/>
    </main>
    </ThemeProvider>
    </body>
    </html>
  );
}