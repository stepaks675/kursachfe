'use server';

import { db } from '@/lib/db';
import { kin4ikauth } from '@/lib/db/schema';
import bcrypt from 'bcrypt';
import { eq, or } from 'drizzle-orm';

export type RegisterData = {
  email: string;
  username: string;
  password: string;
  initial: {
    genres?: string[];
    timePeriod?: string;
    episodeDuration?: string;
  };
};

export type LoginData = {
  email?: string;
  username?: string;
  password: string;
};

export async function checkEmailExists(email: string) {
  try {
    if (!email) {
      return { exists: false };
    }

    const existingUser = await db.query.kin4ikauth.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });

    return { exists: !!existingUser };
  } catch (error) {
    console.error('Error checking email:', error);
    return { exists: false, error: 'Failed to check email' };
  }
}

export async function checkUsernameExists(username: string) {
  try {
    if (!username) {
      return { exists: false };
    }

    const existingUser = await db.query.kin4ikauth.findFirst({
      where: (user, { eq }) => eq(user.username, username),
    });

    return { exists: !!existingUser };
  } catch (error) {
    console.error('Error checking username:', error);
    return { exists: false, error: 'Failed to check username' };
  }
}

export async function registerUser(data: RegisterData) {
  try {
    console.log("Starting user registration for:", data.email);
    
    if (!data.email || !data.username || !data.password) {
      return { success: false, error: 'Все поля обязательны для заполнения' };
    }

    const existingEmail = await db.query.kin4ikauth.findFirst({
      where: (user, { eq }) => eq(user.email, data.email),
    });

    if (existingEmail) {
      return { success: false, error: 'Этот email уже используется' };
    }

    const existingUsername = await db.query.kin4ikauth.findFirst({
      where: (user, { eq }) => eq(user.username, data.username),
    });

    if (existingUsername) {
      return { success: false, error: 'Это имя пользователя уже занято' };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await db.insert(kin4ikauth).values({
      email: data.email,
      username: data.username,
      password: hashedPassword,
      initial: data.initial,
    }).returning({ id: kin4ikauth.id });

    console.log("User created in database with ID:", newUser[0].id);

    // Попытка отправить данные на внешний API (необязательно)
    try {
      if (process.env.API_URL) {
        const sendData = await fetch(process.env.API_URL + '/users/register-initial', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: newUser[0].id,
            email: data.email,
            username: data.username,
            initial: data.initial,
          }),
        });

        if (sendData.ok) {
          console.log("User registered successfully and recorded on the backend");
        } else {
          console.warn("Failed to record user on backend, but registration was successful");
        }
      } else {
        console.warn("API_URL not configured, skipping external API call");
      }
    } catch (apiError) {
      console.warn("External API unavailable, but registration was successful:", apiError);
    }

    console.log("Registration completed successfully for user ID:", newUser[0].id);
    
    return { 
      success: true, 
      data: { 
        id: newUser[0].id 
      } 
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'Не удалось зарегистрировать пользователя' };
  }
}

export async function loginUser(data: LoginData) {
  try {
    if ((!data.email && !data.username) || !data.password) {
      return { success: false, error: 'Логин и пароль обязательны' };
    }

    let user;
    
    if (data.email) {
      user = await db.query.kin4ikauth.findFirst({
        where: (u) => eq(u.email, data.email!),
      });
    } else if (data.username) {
      user = await db.query.kin4ikauth.findFirst({
        where: (u) => eq(u.username, data.username!),
      });
    }

    if (!user) {
      return { success: false, error: 'Неверный логин или пароль' };
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: 'Неверный логин или пароль' };
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
    return { success: false, error: 'Не удалось войти в систему' };
  }
} 