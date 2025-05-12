import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();
// Database connection string
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/kin4ik';

// Create the connection
const client = postgres(connectionString);

// Create the database instance
export const db = drizzle(client, { schema }); 