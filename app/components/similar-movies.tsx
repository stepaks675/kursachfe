"use client"

import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { getAllMoviesMap, getSimilarMovie, saveRecommendationToHistory } from "@/lib/actions/reccomendations"
import { Movie } from "@/lib/types/movie"

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

export default function SimilarMovies() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [allMovies, setAllMovies] = useState<any[]>([])

  useEffect(() => {
    const fetchAllMovies = async () => {
      const result = await getAllMoviesMap();
      if (result.success && result.map) {
        setAllMovies(result.map);
      }
    }
    fetchAllMovies();
  }, [])

  const filteredMovies = allMovies.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSelectMovie = (movie: any) => {
    setSelectedMovie(movie)
    setSearchTerm("")
    setShowDropdown(false)
  }

  const handleFindSimilar = async () => {
    if (!selectedMovie) return;
    
    const result = await getSimilarMovie(selectedMovie.id);
    if (result.success && result.recommendations) {
      setSimilarMovies(result.recommendations);
      setShowResults(true);

      if (result.recommendations.length > 0) {
        await saveRecommendationToHistory(result.recommendations[0]);
      }
    } else {
      setSimilarMovies([]);
      setShowResults(true);
    }
  }

  const handleClearSelection = () => {
    setSelectedMovie(null)
    setShowResults(false)
    setSimilarMovies([])
  }

  return (
    <>
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
                        {movie.title}
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
</div>
      {similarMovies && showResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-3xl rounded-xl bg-gray-800 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowResults(false)}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {similarMovies.length > 0 ? (
              <>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Идеальные сериалы для вас</h3>
                  <p className="text-gray-400">Основываясь на ваших предпочтениях, мы рекомендуем:</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {similarMovies.map((movie, index) => (
                    <div key={index} className="flex flex-col bg-gray-700/50 rounded-lg overflow-hidden">
                      <div className="relative w-full">
                        <img 
                          src={movie.image} 
                          alt={movie.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 font-bold px-2 py-1 rounded text-sm">
                          ★ {movie.rating}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {movie.genres.map((genre, genreIndex) => (
                            <span key={genreIndex} className="bg-purple-600/30 text-purple-200 px-2 py-0.5 rounded-full text-xs">
                              {translateGenre(genre)}
                            </span>
                          ))}
                        </div>
                        
                        <div className="text-gray-400 text-sm mb-3">
                          <span className="mr-3">Год: {movie.year}</span>
                          <span>ID: {movie.id}</span>
                        </div>
                        
                        {movie.description && (
                          <p className="text-gray-300 text-sm line-clamp-3 mb-2">
                            {movie.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-gray-400 text-sm mb-4">
                  Эти сериалы отлично соответствуют вашим предпочтениям. 
                  Насладитесь просмотром качественного кино, которое мы специально подобрали для вас.
                </p>
              </>
            ) : (
              <p className="text-gray-400">К сожалению, мы не смогли найти подходящих рекомендаций. Пожалуйста, попробуйте другие варианты.</p>
            )}

            <button
              onClick={handleClearSelection}
              className="mt-2 w-full flex items-center justify-center rounded-lg border border-purple-500 px-4 py-3 font-medium text-purple-400 transition-colors hover:bg-purple-500/10"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  )
}
