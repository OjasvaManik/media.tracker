"use client"

import React, { useState } from "react"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link01Icon, Note01Icon, TextIcon } from "@hugeicons/core-free-icons"
import { addMediaEntry } from "@/actions/action.media"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { toast } from "sonner";

const mediaSchema = z.object( {
  type: z.enum( [ "manga", "anime", "game" ], {
    message: "Please select a valid media type.",
  } ),
  status: z.enum( [ "reading", "finished", "on_hold", "dropped", "plan_to_start" ], {
    message: "Please select a valid status.",
  } ),
  title: z.string().min( 1, "Title is required." ),
  url: z.union( [ z.literal( "" ), z.string().url( "Please enter a valid URL." ) ] ),
  notes: z.string().optional(),
} )

const AddPage = () => {
  const [ type, setType ] = useState<string>( "" )
  const [ status, setStatus ] = useState<string>( "" )
  const [ title, setTitle ] = useState<string>( "" )
  const [ url, setUrl ] = useState<string>( "" )
  const [ notes, setNotes ] = useState<string>( "" )
  const [ errors, setErrors ] = useState<Record<string, string>>( {} )

  const handleSubmit = async ( e: React.FormEvent ) => {
    e.preventDefault()

    const result = mediaSchema.safeParse( {
      type,
      status,
      title,
      url,
      notes,
    } )

    if ( !result.success ) {
      const formattedErrors: Record<string, string> = {}
      result.error.issues.forEach( ( issue ) => {
        if ( issue.path[ 0 ] ) {
          formattedErrors[ issue.path[ 0 ].toString() ] = issue.message
        }
      } )
      setErrors( formattedErrors )
      return
    }

    setErrors( {} )

    await addMediaEntry( {
      title: result.data.title,
      type: result.data.type,
      status: result.data.status,
      url: result.data.url || undefined,
      notes: result.data.notes || undefined,
    } )

    toast.success( "Media added successfully!" )

    setTitle( "" )
    setType( "" )
    setStatus( "" )
    setUrl( "" )
    setNotes( "" )
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-8 max-w-4xl rounded-lg md:pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground">
          Add Media
        </h1>
        <p className="text-muted-foreground">
          Enter the details to track a new manga, anime, or game.
        </p>
      </div>

      <form onSubmit={ handleSubmit }>
        <FieldGroup className="w-full max-w-4xl">
          <div className="flex gap-4 w-full">
            <Field className="w-1/2">
              <FieldLabel htmlFor="type-select">Media Type</FieldLabel>
              <Select value={ type } onValueChange={ setType }>
                <SelectTrigger id="type-select" className="shadow-sm">
                  <SelectValue placeholder="Select type"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manga">Manga</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="game">Game</SelectItem>
                </SelectContent>
              </Select>
              { errors.type && <p className="text-sm text-destructive mt-1">{ errors.type }</p> }
            </Field>

            <Field className="w-1/2">
              <FieldLabel htmlFor="status-select">Status</FieldLabel>
              <Select value={ status } onValueChange={ setStatus }>
                <SelectTrigger id="status-select" className="shadow-sm">
                  <SelectValue placeholder="Select status"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reading">Reading/Watching/Playing</SelectItem>
                  <SelectItem value="finished">Finished</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                  <SelectItem value="plan_to_start">Plan to Start</SelectItem>
                </SelectContent>
              </Select>
              { errors.status && <p className="text-sm text-destructive mt-1">{ errors.status }</p> }
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="title-input">Title</FieldLabel>
            <InputGroup className="h-auto shadow-sm">
              <InputGroupInput
                id="title-input"
                placeholder="e.g. Frieren: Beyond Journey's End"
                value={ title }
                onChange={ ( e ) => setTitle( e.target.value ) }
              />
              <InputGroupAddon align="block-start">
                <HugeiconsIcon icon={ TextIcon } className="size-4 text-muted-foreground"/>
                <InputGroupText className="font-medium">Media Title</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            { errors.title ? (
              <p className="text-sm text-destructive mt-1">{ errors.title }</p>
            ) : (
              <FieldDescription>The official title of the media.</FieldDescription>
            ) }
          </Field>

          <Field>
            <FieldLabel htmlFor="url-input">Source URL</FieldLabel>
            <InputGroup className="h-auto shadow-sm">
              <InputGroupInput
                id="url-input"
                type="text"
                placeholder="https://..."
                value={ url }
                onChange={ ( e ) => setUrl( e.target.value ) }
              />
              <InputGroupAddon align="block-start">
                <HugeiconsIcon icon={ Link01Icon } className="size-4 text-muted-foreground"/>
                <InputGroupText>External Link</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            { errors.url ? (
              <p className="text-sm text-destructive mt-1">{ errors.url }</p>
            ) : (
              <FieldDescription>Link to reading site, Steam page, or wiki.</FieldDescription>
            ) }
          </Field>

          <Field>
            <FieldLabel htmlFor="notes-textarea">Notes</FieldLabel>
            <InputGroup className="shadow-sm">
              <InputGroupTextarea
                id="notes-textarea"
                placeholder="Any specific thoughts, or where you left off..."
                className="min-h-30"
                value={ notes }
                onChange={ ( e ) => setNotes( e.target.value ) }
              />
              <InputGroupAddon align="block-start">
                <HugeiconsIcon icon={ Note01Icon } className="size-4 text-muted-foreground"/>
                <InputGroupText>Personal Notes</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            { errors.notes && <p className="text-sm text-destructive mt-1">{ errors.notes }</p> }
          </Field>

          <Button
            type="submit"
            variant="default"
            className="mt-2 h-10 flex w-fit items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Save Media
          </Button>
          {/*<Button*/ }
          {/*  variant="default"*/ }
          {/*  className="mt-2 h-10 flex w-fit items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"*/ }
          {/*  onClick={ async () => {*/ }
          {/*    await seedDummyAnime()*/ }
          {/*  } }*/ }
          {/*>*/ }
          {/*  Add Dummy Data*/ }
          {/*</Button>*/ }
        </FieldGroup>
      </form>
    </div>
  )
}

export default AddPage