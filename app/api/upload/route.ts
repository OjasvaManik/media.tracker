import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { db } from "@/db";
import { media } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST( req: NextRequest ) {
  try {
    const formData = await req.formData();
    const file = formData.get( "file" ) as File;
    const id = formData.get( "id" ) as string;
    const type = formData.get( "type" ) as string;
    const title = formData.get( "title" ) as string;

    if ( !file || !id || !type || !title ) {
      return NextResponse.json( { error: "Missing required fields" }, { status: 400 } );
    }

    // Clean title for filename (remove special characters)
    const safeTitle = title.toLowerCase().replace( /[^a-z0-9]/g, "-" );
    const extension = path.extname( file.name );
    const fileName = `${ type }-${ safeTitle }-${ id }${ extension }`;

    // Path: public/{type}/{filename}
    const relativePath = `/${ type }/${ fileName }`;
    const absoluteDirectory = path.join( process.cwd(), "public", type );
    const absolutePath = path.join( absoluteDirectory, fileName );

    // Ensure directory exists
    await fs.mkdir( absoluteDirectory, { recursive: true } );

    // Convert file to buffer and write to disk
    const buffer = Buffer.from( await file.arrayBuffer() );
    await fs.writeFile( absolutePath, buffer );

    // Update the database with the new path
    await db.update( media )
      .set( { cover: relativePath } )
      .where( eq( media.id, id ) );

    return NextResponse.json( { success: true, path: relativePath } );
  } catch ( error ) {
    console.error( "Upload error:", error );
    return NextResponse.json( { error: "Upload failed" }, { status: 500 } );
  }
}