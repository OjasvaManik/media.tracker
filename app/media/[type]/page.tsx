import React from 'react'
import MediaGrid from "@/components/media-grid";

export default async function MediaPage( {
                                           params
                                         }: {
  params: Promise<{ type: string }>
} ) {
  const { type } = await params;

  return (
    <div className='md:pt-4'>
      <MediaGrid type={ type }/>
    </div>
  )
}