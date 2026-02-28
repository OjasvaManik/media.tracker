import { db } from "@/db";
import { media } from "@/db/schema";
import { eq } from "drizzle-orm";
import { writeFileSync } from "fs";

const MANGADEX_BASE = "https://api.mangadex.org";
const COVER_BASE = "https://uploads.mangadex.org/covers";
const UPLOAD_URL = "http://localhost:3001/api/upload";
const FAILED_LOG = "./failed-covers.json";

async function sleep( ms: number ) {
  return new Promise( ( r ) => setTimeout( r, ms ) );
}

async function searchMangaDex( title: string, retries = 3 ): Promise<string | null> {
  for ( let i = 0; i < retries; i++ ) {
    try {
      const res = await fetch(
        `${ MANGADEX_BASE }/manga?title=${ encodeURIComponent( title ) }&limit=1&includes[]=cover_art`
      );
      const json = await res.json();
      const manga = json.data?.[ 0 ];
      if ( !manga ) return null;

      const coverRel = manga.relationships.find( ( r: any ) => r.type === "cover_art" );
      const fileName = coverRel?.attributes?.fileName;
      if ( !fileName ) return null;

      return `${ COVER_BASE }/${ manga.id }/${ fileName }`;
    } catch ( err ) {
      if ( i < retries - 1 ) {
        console.log( `Retrying "${ title }" (attempt ${ i + 2 })...` );
        await sleep( 1000 * ( i + 1 ) ); // 1s, 2s, 3s backoff
      } else {
        throw err;
      }
    }
  }
  return null;
}

async function uploadCover( imageUrl: string, id: string, type: string, title: string ) {
  const imgRes = await fetch( imageUrl );
  if ( !imgRes.ok ) return false;
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
  const withoutCover = allManga;
  console.log( `${ allManga.length } total, ${ withoutCover.length } without cover. Processing...` );

  const failed: string[] = [];

  for ( const entry of withoutCover ) {
    try {
      await sleep( 200 );

      const imageUrl = await searchMangaDex( entry.title );
      if ( !imageUrl ) {
        console.log( `Not found: "${ entry.title }"` );
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