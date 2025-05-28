"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Image from "next/image"
import { getMedianReccomendations } from "@/lib/actions/reccomendations"
import type { Movie } from "@/lib/types/movie"

// Маппинг жанров с английского на русский
const genreMapping: Record<string, string> = {
  action: "Боевик",
  adventure: "Приключения", 
  animation: "Анимация",
  comedy: "Комедия",
  crime: "Криминал",
  documentary: "Документальный",
  drama: "Драма",
  family: "Семейный",
  fantasy: "Фэнтези",
  history: "Исторический",
  horror: "Ужасы",
  music: "Музыкальный",
  mystery: "Мистика",
  romance: "Романтика",
  scifi: "Научная фантастика",
  "sci-fi": "Научная фантастика",
  thriller: "Триллер",
  war: "Военный",
  western: "Вестерн",
  reality: "Реальность",
  documentation: "Документальный",
}

const translateGenre = (genre: string): string => {
  return genreMapping[genre.toLowerCase()] || genre
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      const response = await getMedianReccomendations()
      if (response.success && response.recommendations) {
        setMovies(response.recommendations)
      }
      setIsLoading(false)
    }
    fetchMovies()
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === movies.length - 1 ? 0 : prev + 1))
  }, [movies.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? movies.length - 1 : prev - 1))
  }, [movies.length])

  useEffect(() => {
    if (movies.length === 0) return

    const timeout = setTimeout(() => {
      nextSlide()
    }, 6000)

    return () => clearTimeout(timeout)
  }, [currentSlide, movies.length, nextSlide])

  if (isLoading) {
    return (
      <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] max-h-[700px]">
        <div className="absolute inset-0 bg-gray-900 animate-pulse">
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-8 sm:pb-12 md:pb-16 lg:pb-24">
              <div className="max-w-xs sm:max-w-xl md:max-w-2xl space-y-3 sm:space-y-4">
                <div className="h-4 sm:h-6 w-20 sm:w-24 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-8 sm:h-12 w-full sm:w-3/4 bg-gray-800 rounded animate-pulse"></div>
                <div className="flex gap-1 sm:gap-2">
                  <div className="h-5 sm:h-6 w-12 sm:w-16 bg-gray-800 rounded-full animate-pulse"></div>
                  <div className="h-5 sm:h-6 w-12 sm:w-16 bg-gray-800 rounded-full animate-pulse"></div>
                  <div className="h-5 sm:h-6 w-12 sm:w-16 bg-gray-800 rounded-full animate-pulse"></div>
                </div>
                <div className="h-16 sm:h-20 w-full bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (movies.length === 0) {
    return null
  }

  return (
    <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] max-h-[700px] overflow-hidden">
      <div className="relative h-full w-full">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0">
              <Image
                src={movie.image || "/placeholder.svg"}
                alt={movie.title}
                fill
                className="object-cover object-center sm:object-fill"
                priority={index === currentSlide}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent sm:from-gray-900 sm:via-gray-900/70" />
            </div>

            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-3 sm:px-4 pb-6 sm:pb-8 md:pb-12 lg:pb-16 xl:pb-24">
                <div className="max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2 md:mb-3">
                    <div className="flex items-center space-x-1 bg-purple-600/90 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium backdrop-blur-sm">
                      <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
                      <span className="text-xs">{movie.rating}</span>
                    </div>
                    <div className="text-xs font-medium text-gray-300">{movie.year}</div>
                  </div>

                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-1.5 sm:mb-2 md:mb-3 leading-tight">
                    {movie.title}
                  </h1>

                  <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mb-2 sm:mb-3 md:mb-4">
                    {movie.genres.slice(0, 3).map((genre) => (
                      <span
                        key={genre}
                        className="px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 bg-gray-800/70 backdrop-blur-sm rounded-full text-xs font-medium"
                      >
                        {translateGenre(genre)}
                      </span>
                    ))}
                    {movie.genres.length > 3 && (
                      <span className="px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 bg-gray-800/70 backdrop-blur-sm rounded-full text-xs font-medium">
                        +{movie.genres.length - 3}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-3 sm:mb-4 md:mb-6 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {movie.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-2 sm:px-4 md:px-6 z-10">
        <button
          onClick={prevSlide}
          className="p-1.5 sm:p-2 md:p-3 rounded-full bg-gray-800/70 backdrop-blur-sm hover:bg-gray-700/70 transition-colors touch-manipulation"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="p-1.5 sm:p-2 md:p-3 rounded-full bg-gray-800/70 backdrop-blur-sm hover:bg-gray-700/70 transition-colors touch-manipulation"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </button>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-10">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all touch-manipulation ${
              index === currentSlide 
                ? "w-6 sm:w-8 bg-purple-500" 
                : "w-1.5 sm:w-2 bg-gray-400/60 hover:bg-gray-400/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
