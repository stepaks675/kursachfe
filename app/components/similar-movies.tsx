"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import MovieCard from "./movie-card"

// Моковые данные для сериалов для поиска
const allMovies = [
  {
    id: 201,
    title: "Крестный отец",
    image: "/placeholder.svg?height=600&width=400",
    year: 1972,
    rating: 9.2,
    genres: ["Криминал", "Драма"],
  },
  {
    id: 202,
    title: "Криминальное чтиво",
    image: "/placeholder.svg?height=600&width=400",
    year: 1994,
    rating: 8.9,
    genres: ["Криминал", "Драма"],
  },
  {
    id: 203,
    title: "Бойцовский клуб",
    image: "/placeholder.svg?height=600&width=400",
    year: 1999,
    rating: 8.8,
    genres: ["Драма"],
  },
  {
    id: 204,
    title: "Матрица",
    image: "/placeholder.svg?height=600&width=400",
    year: 1999,
    rating: 8.7,
    genres: ["Боевик", "Фантастика"],
  },
  {
    id: 205,
    title: "Славные парни",
    image: "/placeholder.svg?height=600&width=400",
    year: 1990,
    rating: 8.7,
    genres: ["Биография", "Криминал", "Драма"],
  },
]

// Моковые данные для похожих сериалов
const similarMoviesResults = [
  {
    id: 301,
    title: "Казино",
    image: "/placeholder.svg?height=600&width=400",
    year: 1995,
    rating: 8.2,
    genres: ["Криминал", "Драма"],
  },
  {
    id: 302,
    title: "Схватка",
    image: "/placeholder.svg?height=600&width=400",
    year: 1995,
    rating: 8.3,
    genres: ["Криминал", "Драма", "Триллер"],
  },
  {
    id: 303,
    title: "Отступники",
    image: "/placeholder.svg?height=600&width=400",
    year: 2006,
    rating: 8.5,
    genres: ["Криминал", "Драма", "Триллер"],
  },
  {
    id: 304,
    title: "Лицо со шрамом",
    image: "/placeholder.svg?height=600&width=400",
    year: 1983,
    rating: 8.3,
    genres: ["Криминал", "Драма"],
  },
]

export default function SimilarMovies() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [similarMovies, setSimilarMovies] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  const filteredMovies = allMovies.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSelectMovie = (movie: any) => {
    setSelectedMovie(movie)
    setSearchTerm("")
    setShowDropdown(false)
  }

  const handleFindSimilar = () => {
    // In a real app, we would call an API with the selected movie ID
    setSimilarMovies(similarMoviesResults)
    setShowResults(true)
  }

  const handleClearSelection = () => {
    setSelectedMovie(null)
    setShowResults(false)
    setSimilarMovies([])
  }

  return (
    <div className="transform rounded-xl bg-gray-800/50 p-8 shadow-2xl backdrop-blur-sm transition-all h-full">
      <div className="flex items-center space-x-3 mb-6">
        <Search className="h-8 w-8 text-purple-500" />
        <h2 className="text-2xl font-bold">Найти похожие сериалы</h2>
      </div>

      <p className="text-gray-400 mb-6">Введите сериал, который вам понравился, и мы подберём похожие.</p>

      <div className="relative mb-6">
        <div className="flex items-center space-x-2">
          {selectedMovie && (
            <div className="flex items-center space-x-2 bg-gray-700 px-3 py-2 rounded-lg">
              <span>{selectedMovie.title}</span>
              <button onClick={handleClearSelection} className="p-1 rounded-full hover:bg-gray-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {!selectedMovie && (
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowDropdown(e.target.value.length > 0)
                }}
                onFocus={() => setShowDropdown(searchTerm.length > 0)}
                placeholder="Поиск сериала..."
                className="w-full rounded-lg bg-gray-700/80 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {showDropdown && (
                <div className="absolute z-10 mt-1 w-full rounded-lg bg-gray-700 shadow-lg max-h-60 overflow-auto">
                  {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                      <button
                        key={movie.id}
                        onClick={() => handleSelectMovie(movie)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors"
                      >
                        {movie.title} ({movie.year})
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-400">Сериалы не найдены</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleFindSimilar}
        disabled={!selectedMovie}
        className="group flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        Найти похожие сериалы
      </button>

      {showResults && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Похожие на {selectedMovie?.title} сериалы</h3>

          <div className="grid grid-cols-2 gap-4">
            {similarMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
