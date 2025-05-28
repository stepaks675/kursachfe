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
  return genreMapping[genre?.toLowerCase()] || genre
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSliderPaused, setIsSliderPaused] = useState(false)
  const [expandedDescription, setExpandedDescription] = useState<number | null>(null)

  // Количество фильмов на слайде в зависимости от размера экрана
  const getMoviesPerSlide = () => {
    if (typeof window === 'undefined') return 5
    if (window.innerWidth < 640) return 2 // mobile
    if (window.innerWidth < 768) return 3 // tablet
    if (window.innerWidth < 1024) return 4 // small laptop
    return 5 // desktop
  }

  const [moviesPerSlide, setMoviesPerSlide] = useState(getMoviesPerSlide)

  useEffect(() => {
    const handleResize = () => {
      setMoviesPerSlide(getMoviesPerSlide())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const totalSlides = Math.ceil(movies.length / moviesPerSlide)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }, [totalSlides])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }, [totalSlides])

  useEffect(() => {
    if (totalSlides === 0 || isSliderPaused) return

    const timeout = setTimeout(() => {
      nextSlide()
    }, 6000)

    return () => clearTimeout(timeout)
  }, [currentSlide, totalSlides, nextSlide, isSliderPaused])

  const getCurrentSlideMovies = () => {
    const startIndex = currentSlide * moviesPerSlide
    return movies.slice(startIndex, startIndex + moviesPerSlide)
  }

  const handleMovieHover = (enter: boolean, movieId?: number) => {
    setIsSliderPaused(enter)
    if (!enter) {
      setExpandedDescription(null)
    }
  }

  const handleMovieClick = (movieId: number) => {
    setExpandedDescription(expandedDescription === movieId ? null : movieId)
  }

  if (isLoading) {
    return (
      <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] max-h-[600px] bg-gray-900">
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-800 rounded w-3/4 animate-pulse"></div>
                  <div className="flex gap-1">
                    <div className="h-3 w-8 bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-3 w-8 bg-gray-800 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (movies.length === 0) {
    return null
  }

  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] max-h-[600px] bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="relative w-full">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                const slideMovies = movies.slice(
                  slideIndex * moviesPerSlide,
                  (slideIndex + 1) * moviesPerSlide
                )
                
                return (
                  <div
                    key={slideIndex}
                    className="w-full flex-shrink-0"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                      {slideMovies.map((movie) => (
                        <div
                          key={movie.id}
                          className="group cursor-pointer"
                          onMouseEnter={() => handleMovieHover(true, movie.id)}
                          onMouseLeave={() => handleMovieHover(false)}
                          onClick={() => handleMovieClick(movie.id)}
                        >
                          <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl mb-3 transition-transform duration-300 group-hover:scale-105">
                            <Image
                              src={movie.image || "/placeholder.svg"}
                              alt={movie.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Rating badge */}
                            <div className="absolute top-2 right-2 flex items-center space-x-1 bg-purple-600/90 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                              <Star className="h-3 w-3 fill-current" />
                              <span>{movie.rating}</span>
                            </div>

                            {/* Hover info */}
                            <div className={`absolute bottom-0 left-0 right-0 p-3 transform transition-transform duration-300 ${
                              expandedDescription === movie.id ? 'translate-y-0' : 'group-hover:translate-y-0 translate-y-full'
                            }`}>
                              {/* Дополнительное затемнение для лучшей читаемости */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent -z-10"></div>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {movie.genres.slice(0, 2).map((genre) => (
                                  <span
                                    key={genre}
                                    className="px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full text-xs font-medium text-white"
                                  >
                                    {translateGenre(genre)}
                                  </span>
                                ))}
                              </div>
                              <p className={`text-xs text-white font-medium leading-relaxed ${
                                expandedDescription === movie.id ? '' : 'line-clamp-2'
                              }`}>
                                {movie.description}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-purple-400 transition-colors">
                              {movie.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <span>{movie.year}</span>
                              <span>•</span>
                              <span>{translateGenre(movie.genres[0])}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 sm:p-3 rounded-full bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 transition-colors z-10 shadow-lg"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 sm:p-3 rounded-full bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 transition-colors z-10 shadow-lg"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Slide indicators */}
      {totalSlides > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? "w-8 bg-purple-500" 
                  : "w-2 bg-gray-400/60 hover:bg-gray-400/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
