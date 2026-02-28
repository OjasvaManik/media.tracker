import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { randomUUID } from 'crypto';

export const media = sqliteTable( 'media', {
  id: text( 'id' ).primaryKey().$defaultFn( () => randomUUID() ),
  title: text( 'title' ).notNull(),
  type: text( 'type' ).notNull(),
  status: text( 'status' ).notNull(),
  cover: text( 'cover' ),
  url: text( 'url' ),
  creator: text( 'creator' ),
  isFavorite: integer( 'is_favorite', { mode: 'boolean' } ).default( false ),
  rating: integer( 'rating' ).default( 0 ),
  notes: text( 'notes' ),
  createdAt: integer( 'created_at', { mode: 'timestamp' } ).$defaultFn( () => new Date() ),
  updatedAt: integer( 'updated_at', { mode: 'timestamp' } )
    .$defaultFn( () => new Date() )
    .$onUpdate( () => new Date() ),
} );