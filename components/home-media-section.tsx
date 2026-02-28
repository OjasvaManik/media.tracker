import { getFavorites, getRecentlyAdded, getRecentlyFinished, getRecentlyUpdated } from "@/actions/action.media"
import { HomeMediaSectionClient } from "@/components/home-media-section-client"

export const HomeMediaSection = async ( { type, title }: { type: string, title: string } ) => {
  const [ favorites, added, updated, finished ] = await Promise.all( [
    getFavorites( type ),
    getRecentlyAdded( type ),
    getRecentlyUpdated( type ),
    getRecentlyFinished( type )
  ] )

  if ( !favorites.length && !added.length && !updated.length && !finished.length ) {
    return null
  }

  return (
    <HomeMediaSectionClient
      title={ title }
      favorites={ favorites }
      added={ added }
      updated={ updated }
      finished={ finished }
    />
  )
}