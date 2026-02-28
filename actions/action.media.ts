"use server";

import { db } from '@/db';
import { media } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { and, asc, desc, eq } from "drizzle-orm";

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

export async function getRecentlyAdded() {
  return db
    .select()
    .from( media )
    .orderBy( desc( media.createdAt ) )
    .limit( 10 );
}

export async function getRecentlyFinished() {
  return db
    .select()
    .from( media )
    .where( eq( media.status, 'finished' ) )
    .orderBy( desc( media.updatedAt ) )
    .limit( 10 );
}

export async function getRecentlyUpdated() {
  return db
    .select()
    .from( media )
    .orderBy( desc( media.updatedAt ) )
    .limit( 10 )
}

export async function getAll(
  type: string,
  filter: string = "all",
  sortBy: string = "title",
  sortDir: "ASC" | "DESC" = "ASC"
) {
  let conditions = [ eq( media.type, type ) ];

  if ( filter !== "all" ) {
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