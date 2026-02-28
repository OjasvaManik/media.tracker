"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ImageAdd01Icon, Loading03Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploadProps {
  id: string;
  type: string;
  title: string;
  onSuccess?: ( path: string ) => void;
}

export default function ImageUpload( { id, type, title, onSuccess }: ImageUploadProps ) {
  const [ uploading, setUploading ] = useState( false );
  const [ status, setStatus ] = useState<"idle" | "success" | "error">( "idle" );

  const handleFileChange = async ( e: React.ChangeEvent<HTMLInputElement> ) => {
    const file = e.target.files?.[ 0 ];
    if ( !file ) return;

    setUploading( true );
    setStatus( "idle" );

    const formData = new FormData();
    formData.append( "file", file );
    formData.append( "id", id );
    formData.append( "type", type );
    formData.append( "title", title );

    try {
      const res = await fetch( "/api/upload", {
        method: "POST",
        body: formData,
      } );

      if ( res.ok ) {
        const data = await res.json();
        setStatus( "success" );
        toast.success( "Cover updated successfully!" );
        if ( onSuccess ) onSuccess( data.path );
      } else {
        setStatus( "error" );
      }
    } catch ( err ) {
      setStatus( "error" );
    } finally {
      setUploading( false );
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        id={ `upload-${ id }` }
        className="hidden"
        accept="image/*"
        onChange={ handleFileChange }
        disabled={ uploading }
      />
      <label htmlFor={ `upload-${ id }` }>
        <Button
          asChild
          variant="secondary"
          className={ cn(
            "cursor-pointer transition-all shadow-sm hover:shadow-md h-10 w-32",
            status === "success" && "bg-green-100 text-green-700 hover:bg-green-200"
          ) }
          disabled={ uploading }
        >
          <span>
            { uploading ? (
              <HugeiconsIcon icon={ Loading03Icon } className="mr-2 size-4 animate-spin"/>
            ) : status === "success" ? (
              <HugeiconsIcon icon={ Tick01Icon } className="mr-2 size-4"/>
            ) : (
              <HugeiconsIcon icon={ ImageAdd01Icon } className="mr-2 size-4"/>
            ) }
            { uploading ? "Uploading..." : status === "success" ? "Cover Updated" : "Upload Cover" }
          </span>
        </Button>
      </label>

      { status === "error" && (
        <span className="text-xs text-destructive">Upload failed. Try again.</span>
      ) }
    </div>
  );
}