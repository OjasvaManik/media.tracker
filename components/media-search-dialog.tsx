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
import { getAllForSearch, updateMediaEntry } from "@/actions/action.media"
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
  const [ searchQuery, setSearchQuery ] = useState( "" )
  const [ selectedItem, setSelectedItem ] = useState<any | null>( null )
  const [ editData, setEditData ] = useState<any | null>( null )
  const [ hasChanges, setHasChanges ] = useState( false )

  useEffect( () => {
    if ( !open ) return

    const timer = setTimeout( async () => {
      setLoading( true )
      const data = await getAllForSearch( defaultType, searchQuery )
      setItems( data )
      setLoading( false )
    }, 300 )

    return () => clearTimeout( timer )
  }, [ open, defaultType, searchQuery ] )

  useEffect( () => {
    if ( !hasChanges || !editData ) return

    const timer = setTimeout( async () => {
      await updateMediaEntry( editData.id, editData )
      setHasChanges( false )

      setItems( ( prev ) => prev.map( item => item.id === editData.id ? editData : item ) )
    }, 1000 )

    return () => clearTimeout( timer )
  }, [ editData, hasChanges ] )

  const getIcon = ( type: string ) => {
    if ( type === 'manga' ) return BookOpen01Icon
    if ( type === 'anime' ) return Tv01Icon
    return GameIcon
  }

  const handleEditChange = ( field: string, value: any ) => {
    setEditData( ( prev: any ) => ( { ...prev, [ field ]: value } ) )
    setHasChanges( true )
  }

  return (
    <>
      <CommandDialog open={ open } onOpenChange={ setOpen }>
        <Command>
          <CommandInput
            placeholder={ `Search ${ defaultType === 'all' ? 'media' : defaultType }...` }
            value={ searchQuery }
            onValueChange={ setSearchQuery }
          />
          <CommandList>
            { loading && <CommandEmpty>Loading...</CommandEmpty> }
            { !loading && items.length === 0 && <CommandEmpty>No media found.</CommandEmpty> }

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
        onEditChange={ handleEditChange }
        onImageSuccess={ ( path ) => {
          handleEditChange( "cover", path )
          setItems( ( prev ) => prev.map( i => i.id === editData.id ? { ...i, cover: path } : i ) )
        } }
      />
    </>
  )
}