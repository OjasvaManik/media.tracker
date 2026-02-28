"use client"

import React from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { MediaEditor } from "@/components/media-editor"

interface MediaDrawerProps {
  selectedItem: any
  editData: any
  onClose: () => void
  onEditChange: ( field: string, value: any ) => void
  onImageSuccess: ( path: string ) => void
}

export const MediaDrawer = ( {
                               selectedItem,
                               editData,
                               onClose,
                               onEditChange,
                               onImageSuccess
                             }: MediaDrawerProps ) => {
  return (
    <Drawer
      open={ !!selectedItem }
      onOpenChange={ ( open ) => {
        if ( !open ) onClose()
      } }
    >
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <div className="mx-auto w-full max-w-5xl flex flex-col h-full overflow-hidden">
          <DrawerHeader className="px-4 md:px-6 pt-6 pb-0 shrink-0">
            <DrawerTitle className="sr-only">Edit { editData?.title }</DrawerTitle>
          </DrawerHeader>

          { editData && (
            <MediaEditor
              data={ editData }
              onChange={ onEditChange }
              onImageSuccess={ onImageSuccess }
            />
          ) }
        </div>
      </DrawerContent>
    </Drawer>
  )
}