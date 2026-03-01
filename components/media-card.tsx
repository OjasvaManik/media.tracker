"use client"

import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import DeleteMedia from "@/components/delete-media"

interface MediaCardProps {
  item: any
  onDelete: ( id: string ) => void
}

export const MediaCard = ( { item, onDelete }: MediaCardProps ) => {
  return (
    <div
      className={ cn(
        "group relative w-full h-32 bg-card shadow-md p-3 overflow-hidden cursor-pointer transition-all rounded-md",
        !item.cover && "hover:bg-secondary/60"
      ) }
    >
      { item.cover && (
        <div
          className="absolute right-0 top-0 bottom-0 w-3/5 opacity-70 group-hover:opacity-100 pointer-events-none transition-opacity">
          <Image src={ item.cover } alt="" fill className="object-cover"/>
          <div className="absolute inset-0 bg-linear-to-r from-card via-card/80 to-transparent"/>
        </div>
      ) }
      <div
        className="relative z-10 flex flex-col justify-between h-full hover:text-primary transition-colors">
        <div className="flex justify-between items-start w-full">
          <p className="font-semibold text-base line-clamp-2 pr-2 leading-tight">{ item.title }</p>
          <div className="flex gap-2 items-center">
            { item.isFavorite && (
              <HugeiconsIcon icon={ StarIcon } className="size-4 text-primary fill-primary"/>
            ) }
            <DeleteMedia id={ item.id } cover={ item.cover } type={ item.type } onDeleteSuccess={ onDelete }/>
          </div>
        </div>
        <div className="flex justify-between items-end text-xs text-muted-foreground mt-2">
          <span
            className="bg-muted/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] border border-border/50 capitalize">
            { item.status.replace( "_", " " ) }
          </span>
          <span className="text-[10px]">{ item.rating }/10</span>
        </div>
      </div>
    </div>
  )
}