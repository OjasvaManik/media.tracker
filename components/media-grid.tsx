"use client"

import React, { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getAll, updateMediaEntry } from "@/actions/action.media"
import { Spinner } from "@/components/ui/spinner"
import { MediaFilter } from "@/components/media-filter"
import { MediaCard } from "@/components/media-card"
import { MediaDrawer } from "@/components/media-drawer"

function MediaGridContent( { type }: { type: string } ) {
  const [ items, setItems ] = useState<any[]>( [] )
  const [ loading, setLoading ] = useState( true )
  const [ loadingMore, setLoadingMore ] = useState( false )
  const [ page, setPage ] = useState( 1 )
  const [ hasMore, setHasMore ] = useState( true )
  const [ selectedItem, setSelectedItem ] = useState<any | null>( null )
  const [ editData, setEditData ] = useState<any | null>( null )
  const [ hasChanges, setHasChanges ] = useState( false )

  const searchParams = useSearchParams()
  const filter = searchParams.get( 'filter' ) || 'all'
  const sortBy = searchParams.get( 'sortBy' ) || 'title'
  const sortDir = ( searchParams.get( 'sortDir' ) || 'ASC' ) as "ASC" | "DESC"
  const limit = 20

  useEffect( () => {
    setPage( 1 )
    setHasMore( true )
  }, [ type, filter, sortBy, sortDir ] )

  useEffect( () => {
    const fetchMedia = async () => {
      if ( page === 1 ) {
        setLoading( true )
      } else {
        setLoadingMore( true )
      }

      const data = await getAll( type, filter, sortBy, sortDir, page, limit )

      if ( data.length < limit ) {
        setHasMore( false )
      }

      setItems( prev => page === 1 ? data : [ ...prev, ...data ] )
      setLoading( false )
      setLoadingMore( false )
    }

    fetchMedia()
  }, [ type, filter, sortBy, sortDir, page ] )

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

  return (
    <div className="w-full">
      <MediaFilter/>
      { loading ? (
        <div className="flex justify-center py-8"><Spinner/></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            { items.map( ( item ) => (
              <div key={ item.id } onClick={ () => {
                setSelectedItem( item )
                setEditData( item )
              } }>
                <MediaCard item={ item } onDelete={ handleDeleteSuccess }/>
              </div>
            ) ) }
          </div>

          { hasMore && (
            <div className="flex justify-center mt-8 mb-4">
              <button
                onClick={ () => setPage( p => p + 1 ) }
                disabled={ loadingMore }
                className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                { loadingMore ? "Loading..." : "Load More" }
              </button>
            </div>
          ) }
        </>
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