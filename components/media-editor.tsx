"use client"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import ImageUpload from "@/components/image-upload"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link01Icon, Note01Icon, TextIcon } from "@hugeicons/core-free-icons"

interface MediaEditorProps {
  data: any
  onChange: ( field: string, value: any ) => void
  onImageSuccess: ( path: string ) => void
}

export const MediaEditor = ( { data, onChange, onImageSuccess }: MediaEditorProps ) => {
  return (
    <div
      className="mx-auto w-full max-w-5xl p-4 md:p-6 flex flex-col md:flex-row gap-6 md:gap-8 h-full overflow-y-auto no-scrollbar pb-12 md:pb-20">
      {/* Media Cover Section */ }
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div
          className="relative rounded-lg overflow-hidden bg-muted aspect-3/5 w-1/2 mx-auto md:w-full border border-border shadow-md">
          { data?.cover ? (
            <Image src={ data.cover } alt={ data.title } fill className="object-cover"/>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-muted-foreground italic text-xs md:text-base">No
              Image</div>
          ) }
        </div>
        <div className="mx-auto md:mx-0">
          <ImageUpload id={ data.id } type={ data.type } title={ data.title } onSuccess={ onImageSuccess }/>
        </div>
        <Field className="hidden md:block">
          <div className="justify-between mb-2 flex">
            <FieldLabel>Rating</FieldLabel>
            <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{ data.rating }/10</span>
          </div>
          <Slider value={ [ data.rating || 0 ] } max={ 10 } step={ 1 }
                  onValueChange={ ( [ val ] ) => onChange( "rating", val ) }/>
        </Field>
      </div>

      {/* Form Section */ }
      <div className="w-full md:w-2/3 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Edit Entry</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Favorite</span>
            <Switch checked={ data?.isFavorite || false } onCheckedChange={ ( val ) => onChange( "isFavorite", val ) }/>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Type</FieldLabel>
            <Select value={ data.type } onValueChange={ ( val ) => onChange( "type", val ) }>
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
            <Select value={ data.status } onValueChange={ ( val ) => onChange( "status", val ) }>
              <SelectTrigger className="shadow-sm"><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="reading">Reading/Watching/Playing</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
                <SelectItem value="plan_to_start">Plan to Start</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="edit-title">Title</FieldLabel>
          <InputGroup className="h-auto shadow-sm">
            <InputGroupInput
              id="edit-title"
              value={ data.title || "" }
              onChange={ ( e ) => onChange( "title", e.target.value ) }
            />
            <InputGroupAddon align="block-start">
              <HugeiconsIcon icon={ TextIcon } className="size-4 text-muted-foreground"/>
              <InputGroupText className="font-medium">Media Title</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>The official title of the media.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="edit-creator">Creator / Author / Studio</FieldLabel>
          <InputGroup className="h-auto shadow-sm">
            <InputGroupInput
              id="edit-creator"
              value={ data.creator || "" }
              onChange={ ( e ) => onChange( "creator", e.target.value ) }
            />
            <InputGroupAddon align="block-start">
              <HugeiconsIcon icon={ TextIcon } className="size-4 text-muted-foreground"/>
              <InputGroupText className="font-medium">Creator</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <Field className="md:hidden">
          <div className="flex justify-between mb-2">
            <FieldLabel>Rating</FieldLabel>
            <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{ data.rating }/10</span>
          </div>
          <Slider value={ [ data.rating || 0 ] } max={ 10 } step={ 1 }
                  onValueChange={ ( [ val ] ) => onChange( "rating", val ) }/>
        </Field>

        <Field>
          <FieldLabel htmlFor="edit-url">Source URL</FieldLabel>
          <InputGroup className="h-auto shadow-sm">
            <InputGroupInput
              id="edit-url"
              type="text"
              value={ data.url || "" }
              onChange={ ( e ) => onChange( "url", e.target.value ) }
            />
            <InputGroupAddon align="block-start">
              <HugeiconsIcon icon={ Link01Icon } className="size-4 text-muted-foreground"/>
              <InputGroupText>External Link</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>Link to reading site, Steam page, or wiki.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="edit-notes">Notes</FieldLabel>
          <InputGroup className="shadow-sm">
            <InputGroupTextarea
              id="edit-notes"
              value={ data.notes || "" }
              onChange={ ( e ) => onChange( "notes", e.target.value ) }
              className="min-h-25"
            />
            <InputGroupAddon align="block-start">
              <HugeiconsIcon icon={ Note01Icon } className="size-4 text-muted-foreground"/>
              <InputGroupText>Personal Notes</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </div>
    </div>
  )
}