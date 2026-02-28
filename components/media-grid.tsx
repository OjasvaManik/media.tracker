"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getAll, updateMediaEntry } from "@/actions/action.media"
import { Spinner } from "@/components/ui/spinner"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Field, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupInput, InputGroupTextarea } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import ImageUpload from "@/components/image-upload"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"
import { useSearchParams } from "next/navigation";
import { MediaFilter } from "@/components/media-filter";

export default function MediaGrid( { type }: { type: string } ) {
  const [ items, setItems ] = useState<any[]>( [] )
  const [ loading, setLoading ] = useState( true )
  const [ isMobile, setIsMobile ] = useState( false )
  const [ selectedItem, setSelectedItem ] = useState<any | null>( null )
  const [ editData, setEditData ] = useState<any | null>( null )
  const [ hasChanges, setHasChanges ] = useState( false )

  const searchParams = useSearchParams()

  const filter = searchParams.get( 'filter' ) || 'all'
  const sortBy = searchParams.get( 'sortBy' ) || 'title'
  const sortDir = ( searchParams.get( 'sortDir' ) || 'ASC' ) as "ASC" | "DESC"

  useEffect( () => {
    setLoading( true )
    getAll( type, filter, sortBy, sortDir ).then( ( data ) => {
      setItems( data )
      setLoading( false )
    } )
  }, [ type, filter, sortBy, sortDir ] )

  useEffect( () => {
    const checkMobile = () => setIsMobile( window.innerWidth < 768 )
    checkMobile()
    window.addEventListener( "resize", checkMobile )
    return () => window.removeEventListener( "resize", checkMobile )
  }, [] )

  useEffect( () => {
    if ( !hasChanges || !editData ) return

    const timer = setTimeout( async () => {
      await updateMediaEntry( editData.id, {
        title: editData.title,
        type: editData.type,
        status: editData.status,
        url: editData.url,
        notes: editData.notes,
        creator: editData.creator,
        isFavorite: editData.isFavorite,
        rating: editData.rating,
      } )
      setHasChanges( false )

      setItems( ( prev ) =>
        prev.map( ( item ) => ( item.id === editData.id ? editData : item ) )
      )
    }, 3000 )

    return () => clearTimeout( timer )
  }, [ editData, hasChanges ] )

  const handleEditChange = ( field: string, value: any ) => {
    setEditData( ( prev: any ) => ( { ...prev, [ field ]: value } ) )
    setHasChanges( true )
  }

  const handleCardClick = ( item: any ) => {
    if ( !isMobile ) {
      setSelectedItem( item )
      setEditData( item )
    }
  }

  return (
    <div className="w-full">
      <MediaFilter/>
      { loading ? (
        <div className="flex justify-center py-8"><Spinner/></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
          { items.map( ( item ) => {
            const cardContent = (
              <div
                className={ cn( "group relative w-full h-32 bg-card shadow-md p-3 overflow-hidden cursor-pointer transition-all rounded-md" ) }>
                { item.cover && (
                  <div
                    className="absolute right-0 top-0 bottom-0 w-3/5 opacity-50 group-hover:opacity-100 pointer-events-none transition-opacity">
                    <Image src={ item.cover } alt="" fill className="object-cover" unoptimized/>
                    <div className="absolute inset-0 bg-linear-to-r from-card via-card/80 to-transparent"/>
                  </div>
                ) }
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start w-full">
                    <p className="font-semibold text-base line-clamp-2 pr-2 leading-tight">{ item.title }</p>
                    { item.isFavorite &&
                        <HugeiconsIcon icon={ StarIcon } className="size-4 text-primary fill-primary"/> }
                  </div>
                  <div className="flex justify-between items-end text-xs text-muted-foreground mt-2">
                    <span
                      className="bg-muted/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] border border-border/50 capitalize">{ item.status.replace( "_", " " ) }</span>
                    <span className="text-[10px]">{ item.rating }/10</span>
                  </div>
                </div>
              </div>
            )
            return isMobile ? <Link key={ item.id } href={ `/${ item.type }/${ item.id }` }>{ cardContent }</Link> :
              <div key={ item.id } onClick={ () => handleCardClick( item ) }>{ cardContent }</div>
          } ) }
        </div>
      ) }

      { !isMobile && (
        <Drawer open={ !!selectedItem } onOpenChange={ ( open ) => {
          if ( !open ) {
            setSelectedItem( null );
            setEditData( null );
          }
        } }>
          <DrawerContent className="max-h-[90vh]">
            <div className="mx-auto w-full max-w-5xl p-6 flex gap-8 h-full overflow-y-auto no-scrollbar">

              {/* Left Column: Image & Upload */ }
              <div className="w-1/3 flex flex-col gap-4">
                <div
                  className="relative hidden md:block rounded-lg overflow-hidden bg-muted aspect-3/5 w-full border border-border shadow-md">
                  { editData?.cover ? (
                    <Image src={ editData.cover } alt={ editData.title } fill className="object-cover" unoptimized/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground italic">No
                      Image</div>
                  ) }
                </div>
                { editData && (
                  <ImageUpload
                    id={ editData.id } type={ editData.type } title={ editData.title }
                    onSuccess={ ( path ) => {
                      setEditData( ( prev: any ) => ( { ...prev, cover: path } ) );
                      setItems( ( prev ) => prev.map( ( item ) => ( item.id === editData.id ? {
                        ...item,
                        cover: path
                      } : item ) ) );
                    } }
                  />
                ) }
              </div>

              {/* Right Column: Form Fields */ }
              <div className="w-full md:w-2/3 flex flex-col gap-6">
                <DrawerHeader className="px-0 pt-0 flex justify-between items-center">
                  <DrawerTitle className="text-2xl font-bold">Edit Entry</DrawerTitle>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Favorite</span>
                    <Switch
                      checked={ editData?.isFavorite || false }
                      onCheckedChange={ ( val ) => handleEditChange( "isFavorite", val ) }
                    />
                  </div>
                </DrawerHeader>

                { editData && (
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Media Type</FieldLabel>
                        <Select value={ editData.type } onValueChange={ ( val ) => handleEditChange( "type", val ) }>
                          <SelectTrigger className="shadow-sm"><SelectValue/></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manga">Manga</SelectItem>
                            <SelectItem value="anime">Anime</SelectItem>
                            <SelectItem value="game">Game</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel>Status</FieldLabel>
                        <Select value={ editData.status }
                                onValueChange={ ( val ) => handleEditChange( "status", val ) }>
                          <SelectTrigger className="shadow-sm"><SelectValue/></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reading">Reading/Watching</SelectItem>
                            <SelectItem value="finished">Finished</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="plan_to_start">Plan to Start</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel>Title</FieldLabel>
                      <InputGroup className="h-auto shadow-sm">
                        <InputGroupInput value={ editData.title || "" }
                                         onChange={ ( e ) => handleEditChange( "title", e.target.value ) }/>
                      </InputGroup>
                    </Field>

                    <Field>
                      <FieldLabel>Creator / Author / Studio</FieldLabel>
                      <InputGroup className="h-auto shadow-sm">
                        <InputGroupInput value={ editData.creator || "" }
                                         onChange={ ( e ) => handleEditChange( "creator", e.target.value ) }/>
                      </InputGroup>
                    </Field>

                    <Field>
                      <div className="flex justify-between items-center mb-2">
                        <FieldLabel>Rating</FieldLabel>
                        <span
                          className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{ editData.rating }/10</span>
                      </div>
                      <Slider
                        value={ [ editData.rating || 0 ] }
                        max={ 10 }
                        step={ 1 }
                        onValueChange={ ( [ val ] ) => handleEditChange( "rating", val ) }
                        className="py-4"
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Source URL</FieldLabel>
                      <InputGroup className="h-auto shadow-sm">
                        <InputGroupInput value={ editData.url || "" }
                                         onChange={ ( e ) => handleEditChange( "url", e.target.value ) }/>
                      </InputGroup>
                    </Field>

                    <Field>
                      <FieldLabel>Notes</FieldLabel>
                      <InputGroup className="shadow-sm">
                        <InputGroupTextarea
                          value={ editData.notes || "" }
                          onChange={ ( e ) => handleEditChange( "notes", e.target.value ) }
                          className="min-h-[100px]"
                        />
                      </InputGroup>
                    </Field>
                  </div>
                ) }
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      ) }
    </div>
  )
}