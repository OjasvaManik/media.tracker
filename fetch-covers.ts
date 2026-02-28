// fetch-covers.ts
import { db } from "@/db";
import { media } from "@/db/schema";
import { eq } from "drizzle-orm";
import { writeFileSync } from "fs";

const JIKAN_BASE = "https://api.jikan.moe/v4";
const UPLOAD_URL = "http://localhost:3001/api/upload";
const FAILED_LOG = "./failed-covers.json";

async function sleep( ms: number ) {
  return new Promise( ( r ) => setTimeout( r, ms ) );
}

async function searchManga( title: string ) {
  const res = await fetch( `${ JIKAN_BASE }/manga?q=${ encodeURIComponent( title ) }&limit=1` );
  const json = await res.json();
  return json.data?.[ 0 ] ?? null;
}

async function uploadCover( imageUrl: string, id: string, type: string, title: string ) {
  const imgRes = await fetch( imageUrl );
  const blob = await imgRes.blob();

  const ext = imageUrl.split( "." ).pop()?.split( "?" )[ 0 ] ?? "jpg";
  const formData = new FormData();
  formData.append( "file", new File( [ blob ], `cover.${ ext }`, { type: blob.type } ) );
  formData.append( "id", id );
  formData.append( "type", type );
  formData.append( "title", title );

  const res = await fetch( UPLOAD_URL, { method: "POST", body: formData } );
  return res.ok;
}

async function main() {
  const allManga = await db.select().from( media ).where( eq( media.type, "manga" ) );
  console.log( `Processing ${ allManga.length } manga entries...` );

  const failed: string[] = [];

  for ( const entry of allManga ) {
    if ( entry.cover ) {
      console.log( `Skipping "${ entry.title }" — already has cover` );
      continue;
    }

    try {
      // Jikan rate limit is 3 req/sec, stay safe with 400ms delay
      await sleep( 400 );

      const result = await searchManga( entry.title );
      if ( !result ) {
        console.log( `Not found: "${ entry.title }"` );
        failed.push( entry.title );
        continue;
      }

      const imageUrl = result.images?.jpg?.large_image_url ?? result.images?.jpg?.image_url;
      if ( !imageUrl ) {
        console.log( `No image for: "${ entry.title }"` );
        failed.push( entry.title );
        continue;
      }

      const ok = await uploadCover( imageUrl, entry.id, entry.type, entry.title );
      if ( ok ) {
        console.log( `✓ "${ entry.title }"` );
      } else {
        console.log( `Upload failed: "${ entry.title }"` );
        failed.push( entry.title );
      }
    } catch ( err ) {
      console.error( `Error on "${ entry.title }":`, err );
      failed.push( entry.title );
    }
  }

  writeFileSync( FAILED_LOG, JSON.stringify( failed, null, 2 ) );
  console.log( `\nDone. Failed: ${ failed.length } — see ${ FAILED_LOG }` );
  process.exit( 0 );
}

main();