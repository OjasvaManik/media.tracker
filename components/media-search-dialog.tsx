"use client"

import React, { useEffect, useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { getAllForSearch } from "@/actions/action.media"
import { HugeiconsIcon } from "@hugeicons/react"
import { BookOpen01Icon, GameIcon, Tv01Icon } from "@hugeicons/core-free-icons"
import { MediaDrawer } from "@/components/media-drawer"

interface MediaSearchDialogProps {
  open: boolean;
  setOpen: ( open: boolean ) => void;
  defaultType: string;
}

export function MediaSearchDialog( { open, setOpen, defaultType }: MediaSearchDialogProps ) {
  const [ items, setItems ] = useState<any[]>( [] )
  const [ loading, setLoading ] = useState( false )
  const [ selectedItem, setSelectedItem ] = useState<any | null>( null )
  const [ editData, setEditData ] = useState<any | null>( null )

  useEffect( () => {
    if ( !open ) return

    const fetchMedia = async () => {
      setLoading( true )
      const data = await getAllForSearch( defaultType )
      setItems( data )
      setLoading( false )
    }

    fetchMedia()
  }, [ open, defaultType ] )

  const getIcon = ( type: string ) => {
    if ( type === 'manga' ) return BookOpen01Icon
    if ( type === 'anime' ) return Tv01Icon
    return GameIcon
  }

  return (
    <>
      <CommandDialog open={ open } onOpenChange={ setOpen }>
        <Command>
          <CommandInput placeholder={ `Search ${ defaultType === 'all' ? 'media' : defaultType }...` }/>
          <CommandList>
            { loading && <CommandEmpty>Loading...</CommandEmpty> }
            { !loading && items.length === 0 && <CommandEmpty>No media found.</CommandEmpty> }
            { !loading && items.length > 0 && <CommandEmpty>No results found.</CommandEmpty> }

            { !loading && items.length > 0 && (
              <CommandGroup heading="Results">
                { items.map( ( item ) => (
                  <CommandItem
                    key={ item.id }
                    value={ item.title }
                    onSelect={ () => {
                      setSelectedItem( item )
                      setEditData( item )
                      setOpen( false )
                    } }
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-sidebar/50 transition-all data-selected:bg-sidebar/50"
                  >
                    <div className="flex items-center justify-center size-8 rounded bg-muted">
                      <HugeiconsIcon icon={ getIcon( item.type ) } className="size-4"/>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{ item.title }</span>
                      <span
                        className="text-xs text-muted-foreground capitalize">{ item.status.replace( "_", " " ) }</span>
                    </div>
                  </CommandItem>
                ) ) }
              </CommandGroup>
            ) }
          </CommandList>
        </Command>
      </CommandDialog>

      <MediaDrawer
        selectedItem={ selectedItem }
        editData={ editData }
        onClose={ () => {
          setSelectedItem( null )
          setEditData( null )
        } }
        onEditChange={ ( field, value ) => setEditData( ( prev: any ) => ( { ...prev, [ field ]: value } ) ) }
        onImageSuccess={ ( path ) => setEditData( ( prev: any ) => ( { ...prev, image: path } ) ) }
      />
    </>
  )
}