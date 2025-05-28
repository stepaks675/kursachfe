"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { Movie } from "@/lib/types/movie";
import { db } from "@/lib/db";
import { movieHistory } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { processImageUrl } from "@/lib/utils/image";

const mockMap = [
    { "id": 1, "title": "Breaking Bad" },  { "id": 2, "title": "The Office" }
]
const mockRecommendations: Movie[] = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    rating: 9.3,
    image:
      "https://m.media-amazon.com/images/S/aplus-media-library-service-media/384b4101-a7f0-4792-a9e4-6b5cb0f22ca2.__CR0,0,970,600_PT0_SX970_V1___.jpg",
    year: 1994,
    genres: ["Drama"],
  },
  {
    id: 2,
    title: "The Godfather",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    rating: 9.2,
    image:
      "https://static.life.ru/posts/2016/09/900620/411cee02ed83833671a9636f4309144b.jpg",
    year: 1972,
    genres: ["Crime", "Drama"],
  },
];

export async function getMedianReccomendations(): Promise<{
  success: boolean;
  error?: string;
  recommendations?: Movie[];
}> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return { success: false, error: "Вы не авторизованы" };
  }

  try {
    const endpoint = process.env.API_URL + "/recommendations/profile?id=" + session.user.id;
    console.log("Making request to:", endpoint);
    console.log("Request method: GET");
    console.log("User ID:", session.user.id);
    
    const data = await fetch(endpoint);
    
    console.log("API response status:", data.status);
    
    if (!data.ok) {
      console.log("API request failed, returning mock data");
      return { success: true, recommendations: mockRecommendations };
    }

    const recommendations = await data.json();
    console.log("API response body:", JSON.stringify(recommendations, null, 2));
    
    // Обрабатываем изображения в рекомендациях
    const processedRecommendations = recommendations.map((movie: Movie) => ({
      ...movie,
      image: processImageUrl(movie.image)
    }));
    
    return { success: true, recommendations: processedRecommendations };
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return { success: true, recommendations: mockRecommendations };
  }
}

interface QuizData {
  id: string;
  option: string;
}

export async function getRecommendationQuiz(
  quizData: QuizData[]
): Promise<{ success: boolean; error?: string; recommendation?: Movie[] }> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return { success: false, error: "Вы не авторизованы" };
  }
  try {
    const endpoint = process.env.API_URL + "/recommendations/by-quiz";
    const requestBody = {
      data: quizData,
    };
    
    console.log("Making request to:", endpoint);
    console.log("Request method: POST");
    console.log("Request body:", JSON.stringify(requestBody, null, 2));
    
    const data = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log("API response status:", data.status);
    
    if (!data.ok) {
      console.log("API request failed, returning mock data");
      return { success: true, recommendation: mockRecommendations };
    }
    const recommendation = await data.json();
    console.log("API response body:", JSON.stringify(recommendation, null, 2));
    
    // Обрабатываем изображения в рекомендациях
    const processedRecommendation = recommendation.map((movie: Movie) => ({
      ...movie,
      image: processImageUrl(movie.image)
    }));
    
    return { success: true, recommendation: processedRecommendation };
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return { success: true, recommendation: mockRecommendations };
  }
}

export async function getAllMoviesMap(){
    const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return { success: false, error: "Вы не авторизованы" };
  }

  try {
    const endpoint = process.env.API_URL + "/titles/map";
    console.log("Making request to:", endpoint);
    console.log("Request method: GET");
    
    const data = await fetch(endpoint);
    
    console.log("API response status:", data.status);
    
    if (!data.ok) {
      console.log("API request failed, returning mock data");
      return { success: true, map: mockMap };
    }
    const map = await data.json();
    console.log("API response body:", JSON.stringify(map, null, 2));
    return { success: true, map };
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return { success: true, map: mockMap };
  }  
}

export async function getSimilarMovie(movieId: number): Promise<{ success: boolean; error?: string; recommendations?: Movie[] }>{
    const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return { success: false, error: "Вы не авторизованы" };
  }

  try {
    const endpoint = process.env.API_URL + "/recommendations/similar-by-id?id=" + movieId;
    console.log("Making request to:", endpoint);
    console.log("Request method: GET");
    console.log("Movie ID:", movieId);
    
    const data = await fetch(endpoint);
    
    console.log("API response status:", data.status);
    
    if (!data.ok) {
      console.log("API request failed, returning mock data");
      return { success: true, recommendations: mockRecommendations };
    }
    const recommendations = await data.json();
    console.log("API response body:", JSON.stringify(recommendations, null, 2));
    
    // Обрабатываем изображения в рекомендациях
    const processedRecommendations = recommendations.map((movie: Movie) => ({
      ...movie,
      image: processImageUrl(movie.image)
    }));
    
    return { success: true, recommendations: processedRecommendations };
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return { success: true, recommendations: mockRecommendations };
  } 
}

export async function saveRecommendationToHistory(movie: Movie): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { success: false, error: "Вы не авторизованы" };
  }

  try {
    await db.insert(movieHistory).values({
      userId: parseInt(session.user.id),
      movieId: movie.id,
      movieTitle: movie.title,
      movieDescription: movie.description,
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving recommendation to history:", error);
    return { success: false, error: "Ошибка при сохранении рекомендации" };
  }
}

export async function getRecommendationHistory(): Promise<{
  success: boolean;
  error?: string;
  history?: Array<{
    id: number;
    movieId: number | null;
    movieTitle: string | null;
    movieDescription: string | null;
    createdAt: Date | null;
  }>;
}> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { success: false, error: "Вы не авторизованы" };
  }

  try {
    const history = await db
      .select()
      .from(movieHistory)
      .where(eq(movieHistory.userId, parseInt(session.user.id)))
      .orderBy(desc(movieHistory.createdAt))
      .limit(20);

    return { success: true, history };
  } catch (error) {
    console.error("Error fetching recommendation history:", error);
    return { success: false, error: "Ошибка при получении истории рекомендаций" };
  }
}
