import { pgTable, serial, text, json, integer, timestamp} from 'drizzle-orm/pg-core';

export const kin4ikauth = pgTable('kin4ikauth', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  initial: json('initial').$type<{
    genres?: string[];
    timePeriod?: string;
    episodeDuration?: string;
  }>().default({})
}); 

export const movieHistory = pgTable('rechistory', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'),
  movieId: integer('movie_id'),
  movieTitle: text('movie_title'),
  movieDescription: text('movie_desc'),
  createdAt: timestamp('created_at').defaultNow(),
});
