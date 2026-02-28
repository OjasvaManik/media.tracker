/**
 * Import manga bookmarks from mangakakalot_gg_bookmarks.csv
 *
 * Usage:
 *   npx tsx import-manga.ts
 *   (run from the project root, next to your drizzle db setup)
 */

import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { db } from "@/db";
import { media } from "@/db/schema";

const CSV_PATH = "./mangakakalot_gg_bookmarks.csv";

async function main() {
  const raw = readFileSync( CSV_PATH, "utf-8" );

  const rows = parse( raw, {
    columns: true,       // use first row as header keys
    skip_empty_lines: true,
    trim: true,
  } ) as Array<{
    ID: string;
    Title: string;
    Viewed: string;
    URL: string;
  }>;

  console.log( `Found ${ rows.length } entries. Importing...` );

  let inserted = 0;
  let skipped = 0;

  for ( const row of rows ) {
    const title = row.Title?.trim();
    if ( !title ) {
      console.log( `Skipped row ID ${ row.ID }: empty title` );
      skipped++;
      continue;
    }

    const url = row.URL?.trim() || undefined;
    if ( !url ) console.log( `No URL for: "${ title }"` );
    const viewed = row.Viewed?.trim();

    // Strip the chapter URL down to the manga base URL (optional, remove if you want full URL)
    const mangaBaseUrl = url
      ? url.replace( /\/chapter-[\d.-]+$/, "" )
      : undefined;

    await db.insert( media ).values( {
      title,
      type: "manga",
      status: "reading",           // default — change to "completed" etc. if preferred
      url: mangaBaseUrl ?? url,
      notes: viewed && viewed !== "Not Found" ? `Last read: ${ viewed }` : undefined,
    } );

    inserted++;
  }

  console.log( `Done. Inserted: ${ inserted }, Skipped: ${ skipped }` );
  process.exit( 0 );
}

main().catch( ( err ) => {
  console.error( err );
  process.exit( 1 );
} );
