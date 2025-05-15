'use server';

import { db } from '@/lib/db';
import { kin4ikauth } from '@/lib/db/schema';
import bcrypt from 'bcrypt';

export type RegisterData = {
  email: string;
  username: string;
  password: string;
  initial: {
    favoriteGenre?: string;
    watchFrequency?: string;
    preferredLanguage?: string;
    favoriteActors?: string[];
    seriesPreferences?: string;
  };
};

export type LoginData = {
  email: string;
  password: string;
};

export async function registerUser(data: RegisterData) {
  try {
    if (!data.email || !data.username || !data.password) {
      return { success: false, error: 'All fields are required' };
    }

    const existingUser = await db.query.kin4ikauth.findFirst({
      where: (user, { eq }) => eq(user.email, data.email),
    });

    if (existingUser) {
      return { success: false, error: 'Email already in use' };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await db.insert(kin4ikauth).values({
      email: data.email,
      username: data.username,
      password: hashedPassword,
      initial: data.initial,
    }).returning({ id: kin4ikauth.id });

    return { 
      success: true, 
      data: { 
        id: newUser[0].id 
      } 
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'Failed to register user' };
  }
}

export async function loginUser(data: LoginData) {
  try {
    if (!data.email || !data.password) {
      return { success: false, error: 'Email and password are required' };
    }

    const user = await db.query.kin4ikauth.findFirst({
      where: (u, { eq }) => eq(u.email, data.email),
    });

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
      }
    };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: 'Failed to login' };
  }
} 