"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  Calendar02Icon,
  Clock01Icon,
  FilterHorizontalIcon,
  Sorting05Icon,
  SortingAZ02Icon,
  SortingZA01Icon
} from "@hugeicons/core-free-icons"

export const MediaFilter = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = ( val: string ) => {
    const params = new URLSearchParams( searchParams.toString() )
    params.set( 'filter', val )
    router.push( `?${ params.toString() }` )
  }

  const handleSortChange = ( val: string ) => {
    const params = new URLSearchParams( searchParams.toString() )

    const [ field, dir ] = val.split( '_' )
    params.set( "sortBy", field )
    params.set( "sortDir", dir.toUpperCase() )

    router.push( `?${ params.toString() }` )
  }

  return (
    <div className='flex gap-2 mb-6'>
      <Select onValueChange={ handleFilterChange } defaultValue={ searchParams.get( 'filter' ) || 'all' }>
        <SelectTrigger className='w-48 shadow-sm'>
          <HugeiconsIcon icon={ FilterHorizontalIcon } className="size-4 mr-2"/>
          <SelectValue placeholder='Status'/>
        </SelectTrigger>
        <SelectContent className="z-999">
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="favorites">Favorites</SelectItem>
            <SelectItem value="reading">Reading/Watching</SelectItem>
            <SelectItem value="finished">Finished</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="plan_to_start">Plan to Start</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select onValueChange={ handleSortChange } defaultValue="title_asc">
        <SelectTrigger className='w-48 shadow-sm'>
          <HugeiconsIcon icon={ Sorting05Icon } className="size-4 mr-2"/>
          <SelectValue placeholder='Sort'/>
        </SelectTrigger>
        <SelectContent className="z-999">
          <SelectGroup>
            <SelectLabel>Alphabetical</SelectLabel>
            <SelectItem value="title_asc"><HugeiconsIcon icon={ SortingAZ02Icon } className="inline size-3 mr-1"/> A → Z</SelectItem>
            <SelectItem value="title_desc"><HugeiconsIcon icon={ SortingZA01Icon } className="inline size-3 mr-1"/> Z →
              A</SelectItem>
          </SelectGroup>
          <SelectSeparator/>
          <SelectGroup>
            <SelectLabel>Date</SelectLabel>
            <SelectItem value="updatedAt_desc"><HugeiconsIcon icon={ Clock01Icon }
                                                              className="inline size-3 mr-1"/> Recent
              Activity</SelectItem>
            <SelectItem value="createdAt_desc"><HugeiconsIcon icon={ Calendar01Icon }
                                                              className="inline size-3 mr-1"/> Newly Added</SelectItem>
            <SelectItem value="createdAt_asc"><HugeiconsIcon icon={ Calendar02Icon }
                                                             className="inline size-3 mr-1"/> Oldest Added</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}