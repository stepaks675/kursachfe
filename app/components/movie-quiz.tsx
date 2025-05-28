"use client"

import { useState, type Dispatch, type SetStateAction } from "react"
import { X, Brain, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { getRecommendationQuiz, saveRecommendationToHistory } from "@/lib/actions/reccomendations"

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
  const lowerGenre = genre?.toLowerCase().trim()
  return genreMapping[lowerGenre] || genre
}


const MovieSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-3"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      <div className="flex gap-1">
        <div className="h-3 w-12 bg-gray-700 rounded-full"></div>
        <div className="h-3 w-12 bg-gray-700 rounded-full"></div>
      </div>
    </div>
  </div>
)

const surveyQuestions = [
  {
    id: "genre",
    question: "Какой жанр сериала вам по душе?",
    options: [
      { value: "action", label: "Боевик" },
      { value: "adventure", label: "Приключения" },
      { value: "animation", label: "Анимация" },
      { value: "comedy", label: "Комедия" },
      { value: "crime", label: "Криминал" },
      { value: "documentary", label: "Документальный" },
      { value: "drama", label: "Драма" },
      { value: "family", label: "Семейный" },
      { value: "fantasy", label: "Фэнтези" },
      { value: "history", label: "Исторический" },
      { value: "horror", label: "Ужасы" },
      { value: "music", label: "Музыкальный" },
      { value: "mystery", label: "Мистика" },
      { value: "romance", label: "Романтика" },
      { value: "scifi", label: "Научная фантастика" },
      { value: "thriller", label: "Триллер" },
      { value: "war", label: "Военный" },
      { value: "western", label: "Вестерн" },
    ],
  },
  {
    id: "year",
    question: "В каком десятилетии был выпущен сериал?",
    options: [
      { value: "1990-е", label: "1990-е годы" },
      { value: "2000-е", label: "2000-е годы" },
      { value: "2010-е", label: "2010-е годы" },
      { value: "2020-е", label: "2020-е годы" },
      { value: "any", label: "Любое время" },
    ],
  },
  {
    id: "duration",
    question: "Какая продолжительность эпизода вам предпочтительна?",
    options: [
      { value: "до 60", label: "До 60 минут" },
      { value: "60-120", label: "60-120 минут" },
      { value: "120-180", label: "120-180 минут" },
      { value: "180-210", label: "180-210 минут" },
      { value: "any", label: "Любая продолжительность" },
    ],
  },
  {
    id: "country",
    question: "Какая страна-производитель вам интересна?",
    options: [
      { value: "US", label: "США" },
      { value: "UK", label: "Великобритания" },
      { value: "CA", label: "Канада" },
      { value: "AU", label: "Австралия" },
      { value: "DE", label: "Германия" },
      { value: "FR", label: "Франция" },
      { value: "JP", label: "Япония" },
      { value: "KR", label: "Южная Корея" },
      { value: "RU", label: "Россия" },
      { value: "any", label: "Любая страна" },
    ],
  },
  {
    id: "age",
    question: "Какой возрастной рейтинг предпочитаете?",
    options: [
      { value: "g", label: "G - для всех возрастов" },
      { value: "tv-g", label: "TV-G - для всех возрастов (ТВ)" },
      { value: "tv-y", label: "TV-Y - для детей" },
      { value: "tv-y7", label: "TV-Y7 - для детей от 7 лет" },
      { value: "pg", label: "PG - под руководством родителей" },
      { value: "tv-pg", label: "TV-PG - под руководством родителей (ТВ)" },
      { value: "tv-14", label: "TV-14 - для подростков от 14 лет" },
      { value: "r", label: "R - с ограничениями" },
      { value: "tv-ma", label: "TV-MA - только для взрослых" },
      { value: "any", label: "Любой рейтинг" },
    ],
  },
  {
    id: "mood",
    question: "Сериал с каким настроением сейчас вам по душе?",
    options: [
      { value: "веселое", label: "😊 Веселое" },
      { value: "грустное", label: "😢 Грустное" },
      { value: "печальное", label: "😞 Печальное" },
      { value: "меланхоличное", label: "😔 Меланхоличное" },
      { value: "позитивное", label: "🌞 Позитивное" },
      { value: "трогательное", label: "💖 Трогательное" },
      { value: "радостное", label: "🎉 Радостное" },
      { value: "расслабляющее", label: "😌 Расслабляющее" },
      { value: "захватывающее", label: "🤩 Захватывающее" },
      { value: "any", label: "Любое настроение" },
    ],
  },
  {
    id: "company",
    question: "С какой компанией вы хотите посмотреть сериал?",
    options: [
      { value: "один", label: "👤 Один" },
      { value: "с друзьями", label: "👥 С друзьями" },
      { value: "с семьёй", label: "👨‍👩‍👧‍👦 С семьёй" },
      { value: "с детьми", label: "👶 С детьми" },
      { value: "any", label: "Любая компания" },
    ],
  },
]

interface MovieQuizProps {
  onOpenSurvey: () => void
  surveyResults: any[] | null
  setSurveyResults: Dispatch<SetStateAction<any[] | null>>
  showSurveyModal: boolean
  setShowSurveyModal: Dispatch<SetStateAction<boolean>>
}

export default function MovieQuiz({
  onOpenSurvey,
  surveyResults,
  setSurveyResults,
  showSurveyModal,
  setShowSurveyModal,
}: MovieQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedDescription, setExpandedDescription] = useState<number | null>(null)

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const nextQuestion = async () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setIsLoading(true)
      try {
        const quizData = Object.entries(answers).map(([id, option]) => ({
          id,
          option
        }));

        const result = await getRecommendationQuiz(quizData);
        
        if (result.success && result.recommendation) {
          setSurveyResults(result.recommendation);

          // Сохраняем каждый фильм из массива в историю
          for (const movie of result.recommendation) {
            await saveRecommendationToHistory(movie);
          }
        }
        setShowSurveyModal(false);
        setShowResults(true);
        setCurrentQuestion(0);
      } catch (error) {
        console.error("Error getting recommendation:", error);
        setShowSurveyModal(false);
        setShowResults(true);
        setCurrentQuestion(0);
      } finally {
        setIsLoading(false)
      }
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const resetSurvey = () => {
    setSurveyResults(null)
    setAnswers({})
    setShowResults(false)
    setCurrentQuestion(0)
  }

  const handleMovieClick = (movieIndex: number) => {
    setExpandedDescription(expandedDescription === movieIndex ? null : movieIndex)
  }

  return (
    <>
      <div className="rounded-xl bg-gray-800/50 p-8 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="h-8 w-8 text-purple-500" />
          <h2 className="text-2xl font-bold">Подбор сериала по вкусу</h2>
        </div>

        <div>
          <p className="text-gray-400 mb-6">
            Не знаете, что посмотреть? Ответьте на несколько вопросов, и мы порекомендуем сериалы, подходящие вашему настроению и предпочтениям.
          </p>

          <button
            onClick={onOpenSurvey}
            className="group flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-500"
          >
            Пройти опрос
            <ArrowRight className="ml-2 h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {showSurveyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-xl rounded-xl bg-gray-800 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {setShowSurveyModal(false)
                resetSurvey()
              }}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Подбираем сериалы для вас</h3>
                <p className="text-gray-400 text-center">
                  Анализируем ваши предпочтения и ищем идеальные варианты...
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">Подбор сериала</h3>
                  <p className="text-gray-400 text-sm">
                    Вопрос {currentQuestion + 1} из {surveyQuestions.length}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-4">{surveyQuestions[currentQuestion].question}</h4>

                  <div className="space-y-3">
                    {surveyQuestions[currentQuestion].options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(surveyQuestions[currentQuestion].id, option.value)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          answers[surveyQuestions[currentQuestion].id] === option.value
                            ? "bg-purple-600 text-white"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  {currentQuestion > 0 && (
                    <button
                      onClick={prevQuestion}
                      className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      <span>Назад</span>
                    </button>
                  )}
                  <div className={currentQuestion === 0 ? "w-full flex justify-end" : ""}>
                    <button
                      onClick={nextQuestion}
                      disabled={!answers[surveyQuestions[currentQuestion].id]}
                      className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                      <span>{currentQuestion === surveyQuestions.length - 1 ? "Готово" : "Дальше"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {surveyResults && showResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-6xl rounded-xl bg-gray-800 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowResults(false)}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-700 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {isLoading ? (
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Подбираем сериалы для вас</h3>
                  <p className="text-gray-400">Анализируем ваши предпочтения...</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <MovieSkeleton key={i} />
                  ))}
                </div>
              </div>
            ) : surveyResults.length > 0 ? (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Идеальный выбор для вас</h3>
                  <p className="text-gray-400">Основываясь на ваших предпочтениях, мы рекомендуем:</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                  {surveyResults.map((movie, index) => (
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
                
                <p className="text-gray-400 text-sm mb-6">
                  Эти сериалы отлично соответствуют вашим предпочтениям. 
                  Насладитесь просмотром качественного кино, которое мы специально подобрали для вас.
                </p>
              </>
            ) : (
              <p className="text-gray-400">К сожалению, мы не смогли найти подходящих рекомендаций. Пожалуйста, попробуйте другие варианты.</p>
            )}

            <button
              onClick={resetSurvey}
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