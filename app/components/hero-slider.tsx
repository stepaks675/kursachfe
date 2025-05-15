"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Star, Clock, Play } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Моковые данные для избранных сериалов
const featuredMovies = [
  {
    id: 1,
    title: "Дюна: Часть вторая",
    description:
      "Пол Атрейдес объединяется с Чани и фременами, чтобы отомстить заговорщикам, уничтожившим его семью.",
    image: "/placeholder.svg?height=1080&width=1920",
    banner: "https://i.pinimg.com/originals/61/81/52/618152b971ff5b62749da0fb08d8de37.jpg",
    rating: 8.6,
    year: 2024,

    genres: ["Фантастика", "Приключения", "Драма"],
  },
  {
    id: 2,
    title: "Оппенгеймер",
    description:
      "История американского учёного Роберта Оппенгеймера и его роли в создании атомной бомбы.",
    image: "/placeholder.svg?height=1080&width=1920",
    banner: "https://i.pinimg.com/originals/61/81/52/618152b971ff5b62749da0fb08d8de37.jpg",
    rating: 8.4,
    year: 2023,

    genres: ["Биография", "Драма", "История"],
  },
  {
    id: 3,
    title: "Бэтмен",
    description:
      "Когда садист-убийца начинает убивать ключевых политиков Готэма, Бэтмен вынужден расследовать эти преступления.",
    image: "/placeholder.svg?height=1080&width=1920",
    banner: "https://i.pinimg.com/originals/61/81/52/618152b971ff5b62749da0fb08d8de37.jpg",
    rating: 7.8,
    year: 2022,

    genres: ["Боевик", "Криминал", "Драма"],
  },
  {
    id: 4,
    title: "Всё везде и сразу",
    description:
      "Пожилая китаянка оказывается втянута в безумное приключение, где только она может спасти мир, исследуя другие вселенные.",
    image: "/placeholder.svg?height=1080&width=1920",
    banner: "https://i.pinimg.com/originals/61/81/52/618152b971ff5b62749da0fb08d8de37.jpg",
    rating: 7.9,
    year: 2022,

    genres: ["Боевик", "Приключения", "Комедия"],
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === featuredMovies.length - 1 ? 0 : prev + 1))
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1))
  }, [])

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 6000)

    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full w-full">
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0">
              <Image
                src={movie.banner || "/placeholder.svg"}
                alt={movie.title}
                fill
                className="object-cover"
                priority={index === currentSlide}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
            </div>

            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 pb-16 md:pb-24">
                <div className="max-w-2xl">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1 bg-purple-600/80 px-2 py-1 rounded text-xs font-medium">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{movie.rating}</span>
                    </div>
                    <div className="text-xs font-medium text-gray-300">{movie.year}</div>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-bold mb-3">{movie.title}</h1>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-gray-800/60 backdrop-blur-sm rounded-full text-xs font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-300 mb-6 line-clamp-3">{movie.description}</p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={`/movie/${movie.id}`}
                      className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors"
                    >
                      <Play className="h-5 w-5 fill-current" />
                      <span>Смотреть сейчас</span>
                    </Link>
                    <Link
                      href={`/movie/${movie.id}/details`}
                      className="px-6 py-3 bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-sm rounded-lg font-medium transition-colors"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-800/60 backdrop-blur-sm hover:bg-gray-700/60 transition-colors z-10"
        aria-label="Предыдущий слайд"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-800/60 backdrop-blur-sm hover:bg-gray-700/60 transition-colors z-10"
        aria-label="Следующий слайд"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-purple-500" : "bg-gray-400/50 hover:bg-gray-400"
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
