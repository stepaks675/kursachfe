'use server';

import { db } from '@/lib/db';
import { kin4ikauth } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';

export type UserPreferences = {
  genres?: string[];
  timePeriod?: string;
  episodeDuration?: string;
};

export async function getUserPreferences(): Promise<{ 
  success: boolean; 
  data?: UserPreferences; 
  error?: string 
}> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return { success: false, error: 'Вы не авторизованы' };
    }

    const user = await db.query.kin4ikauth.findFirst({
      where: (user, { eq }) => eq(user.email, session.user.email),
      columns: {
        initial: true
      }
    });

    if (!user) {
      return { success: false, error: 'Пользователь не найден' };
    }

    return {
      success: true,
      data: user.initial as UserPreferences
    };
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return { success: false, error: 'Не удалось получить предпочтения пользователя' };
  }
} 