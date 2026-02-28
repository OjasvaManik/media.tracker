import React from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeMediaSection } from "@/components/home-media-section"

const HomePage = () => {
  return (
    <div className="flex flex-col pb-12">
      <Button
        variant="default"
        className="h-10 w-full uppercase bg-accent text-accent-foreground lg:hidden"
        asChild
      >
        <Link href={ '/add' }>
          Add Title
        </Link>
      </Button>

      <HomeMediaSection type="manga" title="Manga"/>
      <HomeMediaSection type="anime" title="Anime"/>
      <HomeMediaSection type="game" title="Games"/>
    </div>
  )
}

export default HomePage