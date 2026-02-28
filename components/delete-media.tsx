"use client"

import React, { useTransition } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { DeleteThrowIcon } from "@hugeicons/core-free-icons"
import { deleteMediaEntry } from "@/actions/action.media"
import { toast } from "sonner"

interface DeleteMediaProps {
  id: string;
  cover?: string | null;
  type?: string;
  onDeleteSuccess: ( id: string ) => void;
}

const DeleteMedia = ( { id, cover, type, onDeleteSuccess }: DeleteMediaProps ) => {
  const [ isPending, startTransition ] = useTransition();

  const handleDelete = () => {
    startTransition( async () => {
      await deleteMediaEntry( id, cover, type );
      onDeleteSuccess( id );
      toast.success( "Media deleted successfully!" );
    } );
  };

  return (
    <div onClick={ ( e ) => {
      e.preventDefault();
      e.stopPropagation();
    } }>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 hover:bg-transparent"
          >
            <HugeiconsIcon icon={ DeleteThrowIcon } className="size-4 text-primary"/>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent onClick={ ( e ) => e.stopPropagation() }>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this media
              from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={ isPending }>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={ handleDelete } disabled={ isPending }>
              { isPending ? "Deleting..." : "Continue" }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DeleteMedia