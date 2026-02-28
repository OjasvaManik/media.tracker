"use client"

import React, { useEffect, useState } from "react"
import { HomeMediaCard } from "@/components/home-media-card"
import { MediaDrawer } from "@/components/media-drawer"
import { updateMediaEntry } from "@/actions/action.media"
import { Separator } from "@/components/ui/separator";

interface HomeMediaSectionClientProps {
  title: string
  favorites: any[]
  added: any[]
  updated: any[]
  finished: any[]
}

export const HomeMediaSectionClient = ( {
                                          title,
                                          favorites,
                                          added,
                                          updated,
                                          finished
                                        }: HomeMediaSectionClientProps ) => {
  const [ favs, setFavs ] = useState( favorites )
  const [ adds, setAdds ] = useState( added )
  const [ upds, setUpds ] = useState( updated )
  const [ fins, setFins ] = useState( finished )

  const [ selectedItem, setSelectedItem ] = useState<any | null>( null )
  const [ editData, setEditData ] = useState<any | null>( null )
  const [ hasChanges, setHasChanges ] = useState( false )

  useEffect( () => {
    if ( !hasChanges || !editData ) return

    const timer = setTimeout( async () => {
      await updateMediaEntry( editData.id, editData )
      setHasChanges( false )

      const updateList = ( list: any[] ) => list.map( item => item.id === editData.id ? editData : item )
      setFavs( updateList )
      setAdds( updateList )
      setUpds( updateList )
      setFins( updateList )
    }, 1000 )

    return () => clearTimeout( timer )
  }, [ editData, hasChanges ] )

  const handleEditChange = ( field: string, value: any ) => {
    setEditData( ( prev: any ) => ( { ...prev, [ field ]: value } ) )
    setHasChanges( true )
  }

  const handleDeleteSuccess = ( deletedId: string ) => {
    const filterList = ( list: any[] ) => list.filter( item => item.id !== deletedId )
    setFavs( filterList )
    setAdds( filterList )
    setUpds( filterList )
    setFins( filterList )
  }

  const Row = ( { rowTitle, items }: { rowTitle: string, items: any[] } ) => {
    if ( !items.length ) return null

    return (
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-muted-foreground text-sm tracking-wide uppercase">{ rowTitle }</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
          { items.map( item => (
            <HomeMediaCard
              key={ item.id }
              item={ item }
              onDelete={ handleDeleteSuccess }
              onClick={ () => {
                setSelectedItem( item )
                setEditData( item )
              } }
            />
          ) ) }
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 py-4">
      <h2 className="text-3xl font-bold font-sans tracking-tight uppercase">{ title }</h2>
      <Separator/>
      <div className="flex flex-col gap-5">
        <Row rowTitle="Favorites" items={ favs }/>
        <Row rowTitle="Recently Added" items={ adds }/>
        <Row rowTitle="Recently Updated" items={ upds }/>
        <Row rowTitle="Recently Finished" items={ fins }/>
      </div>

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
          const updateList = ( list: any[] ) => list.map( i => i.id === editData.id ? { ...i, cover: path } : i )
          setFavs( updateList )
          setAdds( updateList )
          setUpds( updateList )
          setFins( updateList )
        } }
      />
    </div>
  )
}