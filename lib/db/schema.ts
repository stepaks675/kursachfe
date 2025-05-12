import { pgTable, serial, text, json, varchar } from 'drizzle-orm/pg-core';

export const kin4ikauth = pgTable('kin4ikauth', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  initial: json('initial').$type<{
    favoriteGenre?: string;
    watchFrequency?: string;
    preferredLanguage?: string;
    favoriteActors?: string[];
    moviePreferences?: string;
  }>().default({})
}); 