"use client"

import React, { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getAll, updateMediaEntry } from "@/actions/action.media"
import { Spinner } from "@/components/ui/spinner"
import { MediaFilter } from "@/components/media-filter"
import { MediaCard } from "@/components/media-card"
import { MediaDrawer } from "@/components/media-drawer"
import { toast } from "sonner";

function MediaGridContent( { type }: { type: string } ) {
  const [ items, setItems ] = useState<any[]>( [] )
  const [ loading, setLoading ] = useState( true )
  const [ selectedItem, setSelectedItem ] = useState<any | null>( null )
  const [ editData, setEditData ] = useState<any | null>( null )
  const [ hasChanges, setHasChanges ] = useState( false )

  const searchParams = useSearchParams()
  const filter = searchParams.get( 'filter' ) || 'all'
  const sortBy = searchParams.get( 'sortBy' ) || 'title'
  const sortDir = ( searchParams.get( 'sortDir' ) || 'ASC' ) as "ASC" | "DESC"

  useEffect( () => {
    toast( type )
    setLoading( true )
    getAll( type, filter, sortBy, sortDir ).then( ( data ) => {
      setItems( data )
      setLoading( false )
    } )
  }, [ type, filter, sortBy, sortDir ] )

  useEffect( () => {
    if ( !hasChanges || !editData ) return
    const timer = setTimeout( async () => {
      await updateMediaEntry( editData.id, editData )
      setHasChanges( false )
      setItems( prev => prev.map( item => item.id === editData.id ? editData : item ) )
    }, 1000 )
    return () => clearTimeout( timer )
  }, [ editData, hasChanges ] )

  const handleEditChange = ( field: string, value: any ) => {
    setEditData( ( prev: any ) => ( { ...prev, [ field ]: value } ) )
    setHasChanges( true )
  }

  const handleDeleteSuccess = ( deletedId: string ) => {
    setItems( ( prev ) => prev.filter( ( item ) => item.id !== deletedId ) )
  }

  const sortedItems = [ ...items ].sort( ( a, b ) => {
    if ( a.isFavorite === b.isFavorite ) return 0
    return a.isFavorite ? -1 : 1
  } )

  return (
    <div className="w-full">
      <MediaFilter/>
      { loading ? (
        <div className="flex justify-center py-8"><Spinner/></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          { sortedItems.map( ( item ) => (
            <div key={ item.id } onClick={ () => {
              setSelectedItem( item )
              setEditData( item )
            } }>
              <MediaCard item={ item } onDelete={ handleDeleteSuccess }/>
            </div>
          ) ) }
        </div>
      ) }

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
          setItems( prev => prev.map( i => i.id === editData.id ? { ...i, cover: path } : i ) )
        } }
      />
    </div>
  )
}

export default function MediaGrid( props: { type: string } ) {
  return (
    <Suspense fallback={ <div className="flex justify-center py-8"><Spinner/></div> }>
      <MediaGridContent { ...props } />
    </Suspense>
  )
}