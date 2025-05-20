import { pgTable, serial, text, json} from 'drizzle-orm/pg-core';

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