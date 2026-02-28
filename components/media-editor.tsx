"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import { InputGroupInput, InputGroupTextarea } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import ImageUpload from "@/components/image-upload"
import Image from "next/image"

interface MediaEditorProps {
  data: any
  onChange: ( field: string, value: any ) => void
  onImageSuccess: ( path: string ) => void
}

export const MediaEditor = ( { data, onChange, onImageSuccess }: MediaEditorProps ) => {
  return (
    <div className="mx-auto w-full max-w-5xl p-6 flex flex-col md:flex-row gap-8 h-full overflow-y-auto no-scrollbar">
      {/* Media Cover Section */ }
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="relative rounded-lg overflow-hidden bg-muted aspect-3/5 w-full border border-border shadow-md">
          { data?.cover ? (
            <Image src={ data.cover } alt={ data.title } fill className="object-cover" unoptimized/>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground italic">No Image</div>
          ) }
        </div>
        <ImageUpload id={ data.id } type={ data.type } title={ data.title } onSuccess={ onImageSuccess }/>
      </div>

      {/* Form Section */ }
      <div className="w-full md:w-2/3 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Entry</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Favorite</span>
            <Switch checked={ data?.isFavorite || false } onCheckedChange={ ( val ) => onChange( "isFavorite", val ) }/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Type</FieldLabel>
            <Select value={ data.type } onValueChange={ ( val ) => onChange( "type", val ) }>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="manga">Manga</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="game">Game</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select value={ data.status } onValueChange={ ( val ) => onChange( "status", val ) }>
              <SelectTrigger><SelectValue/></SelectTrigger>
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
          <InputGroupInput value={ data.title || "" } onChange={ ( e ) => onChange( "title", e.target.value ) }/>
        </Field>

        <Field>
          <FieldLabel>Creator</FieldLabel>
          <InputGroupInput value={ data.creator || "" } onChange={ ( e ) => onChange( "creator", e.target.value ) }/>
        </Field>

        <Field>
          <div className="flex justify-between mb-2">
            <FieldLabel>Rating</FieldLabel>
            <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{ data.rating }/10</span>
          </div>
          <Slider value={ [ data.rating || 0 ] } max={ 10 } step={ 1 }
                  onValueChange={ ( [ val ] ) => onChange( "rating", val ) }/>
        </Field>

        <Field>
          <FieldLabel>Source URL</FieldLabel>
          <InputGroupInput value={ data.url || "" } onChange={ ( e ) => onChange( "url", e.target.value ) }/>
        </Field>

        <Field>
          <FieldLabel>Notes</FieldLabel>
          <InputGroupTextarea value={ data.notes || "" } onChange={ ( e ) => onChange( "notes", e.target.value ) }
                              className="min-h-[100px]"/>
        </Field>
      </div>
    </div>
  )
}