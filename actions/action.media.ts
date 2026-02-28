"use server";

import { db } from '@/db';
import { media } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { and, asc, desc, eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

export async function addMediaEntry( data: {
  title: string;
  type: string;
  status: string;
  cover?: string;
  url?: string;
  creator?: string;
  isFavorite?: boolean;
  rating?: number;
  notes?: string;
} ) {
  await db.insert( media ).values( {
    title: data.title,
    type: data.type,
    status: data.status,
    cover: data.cover,
    url: data.url,
    creator: data.creator,
    isFavorite: data.isFavorite,
    rating: data.rating,
    notes: data.notes,
  } );

  revalidatePath( '/' );
}

export async function getFavorites( type: string ) {
  return db
    .select()
    .from( media )
    .where( and( eq( media.type, type ), eq( media.isFavorite, true ) ) )
    .orderBy( desc( media.updatedAt ) )
    .limit( 10 );
}

export async function getRecentlyAdded( type: string ) {
  return db
    .select()
    .from( media )
    .where( eq( media.type, type ) )
    .orderBy( desc( media.createdAt ) )
    .limit( 10 );
}

export async function getRecentlyUpdated( type: string ) {
  return db
    .select()
    .from( media )
    .where( eq( media.type, type ) )
    .orderBy( desc( media.updatedAt ) )
    .limit( 10 );
}

export async function getRecentlyFinished( type: string ) {
  return db
    .select()
    .from( media )
    .where( and( eq( media.type, type ), eq( media.status, 'finished' ) ) )
    .orderBy( desc( media.updatedAt ) )
    .limit( 10 );
}

export async function getAll(
  type: string,
  filter: string = "all",
  sortBy: string = "title",
  sortDir: "ASC" | "DESC" = "ASC"
) {
  let conditions = [ eq( media.type, type ) ];

  if ( filter === "favorites" ) {
    conditions.push( eq( media.isFavorite, true ) );
  } else if ( filter !== "all" ) {
    conditions.push( eq( media.status, filter ) );
  }

  const orderColumn = sortBy === "title" ? media.title :
    sortBy === "createdAt" ? media.createdAt :
      media.updatedAt;

  const orderFn = sortDir === "DESC" ? desc : asc;

  return db
    .select()
    .from( media )
    .where( and( ...conditions ) )
    .orderBy( orderFn( orderColumn ) );
}

export async function updateMediaEntry( id: string, data: {
  title?: string;
  type?: string;
  status?: string;
  url?: string;
  notes?: string;
  creator?: string;
  isFavorite?: boolean;
  rating?: number;
} ) {
  await db.update( media )
    .set( data )
    .where( eq( media.id, id ) );

  revalidatePath( '/' );

  if ( data.type ) {
    revalidatePath( `/${ data.type }` );
    revalidatePath( `/${ data.type }/${ id }` );
  }
}

export async function deleteMediaEntry( id: string, coverPath?: string | null, type?: string ) {
  await db.delete( media ).where( eq( media.id, id ) );

  if ( coverPath ) {
    const absolutePath = path.join( process.cwd(), "public", coverPath );
    try {
      await fs.unlink( absolutePath );
    } catch ( err: any ) {
      if ( err.code !== 'ENOENT' ) {
        console.error( err );
      }
    }
  }

  revalidatePath( '/' );
  if ( type ) {
    revalidatePath( `/${ type }` );
  }
}

export async function getAllForSearch( type: string ) {
  if ( type === 'all' ) {
    return db.select().from( media ).orderBy( desc( media.updatedAt ) );
  }
  return db
    .select()
    .from( media )
    .where( eq( media.type, type ) )
    .orderBy( desc( media.updatedAt ) );
}