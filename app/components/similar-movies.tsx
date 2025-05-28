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
  return genreMapping[genre?.toLowerCase()] || genre
}

export default function SimilarMovies() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [allMovies, setAllMovies] = useState<any[]>([])
  const [expandedDescription, setExpandedDescription] = useState<number | null>(null)

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

  const handleMovieClick = (movieIndex: number) => {
    setExpandedDescription(expandedDescription === movieIndex ? null : movieIndex)
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
          <div className="w-full max-w-6xl rounded-xl bg-gray-800 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowResults(false)}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-700 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {similarMovies.length > 0 ? (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Идеальные сериалы для вас</h3>
                  <p className="text-gray-400">Основываясь на ваших предпочтениях, мы рекомендуем:</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                  {similarMovies.map((movie, index) => (
                    <div 
                      key={index} 
                      className="group cursor-pointer"
                      onClick={() => handleMovieClick(index)}
                    >
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg mb-3 transition-transform duration-300 group-hover:scale-105">
                        <img 
                          src={movie.image} 
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Rating badge */}
                        <div className="absolute top-2 right-2 bg-purple-600/90 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                          ★ {movie.rating}
                        </div>

                        {/* Hover info */}
                        <div className={`absolute bottom-0 left-0 right-0 p-3 transform transition-transform duration-300 ${
                          expandedDescription === index ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'
                        }`}>
                          {/* Дополнительное затемнение для лучшей читаемости */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent -z-10"></div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {movie.genres.slice(0, 2).map((genre: string, genreIndex: number) => (
                              <span key={genreIndex} className="px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                                {translateGenre(genre)}
                              </span>
                            ))}
                          </div>
                          <p className={`text-xs text-white font-medium leading-relaxed ${
                            expandedDescription === index ? '' : 'line-clamp-2'
                          }`}>
                            {movie.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-purple-400 transition-colors">
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
