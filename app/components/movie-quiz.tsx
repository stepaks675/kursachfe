"use client"

import { useState, type Dispatch, type SetStateAction } from "react"
import { X, Brain, ArrowRight } from "lucide-react"
import MovieCard from "./movie-card"

// Моковые данные для рекомендованных сериалов после опроса
const recommendedMovies = [
  {
    id: 101,
    title: "Начало",
    image: "/placeholder.svg?height=600&width=400",
    year: 2010,
    rating: 8.8,
    genres: ["Фантастика", "Боевик", "Триллер"],
  },
  {
    id: 102,
    title: "Побег из Шоушенка",
    image: "/placeholder.svg?height=600&width=400",
    year: 1994,
    rating: 9.3,
    genres: ["Драма"],
  },
  {
    id: 103,
    title: "Паразиты",
    image: "/placeholder.svg?height=600&width=400",
    year: 2019,
    rating: 8.5,
    genres: ["Триллер", "Драма", "Комедия"],
  },
  {
    id: 104,
    title: "Тёмный рыцарь",
    image: "/placeholder.svg?height=600&width=400",
    year: 2008,
    rating: 9.0,
    genres: ["Боевик", "Криминал", "Драма"],
  },
]

// Вопросы опроса
const surveyQuestions = [
  {
    id: "genre",
    question: "Какой жанр сериалов вы хотите посмотреть?",
    options: [
      { value: "action", label: "Боевик" },
      { value: "comedy", label: "Комедия" },
      { value: "drama", label: "Драма" },
      { value: "horror", label: "Ужасы" },
      { value: "sci-fi", label: "Фантастика" },
      { value: "thriller", label: "Триллер" },
    ],
  },
  {
    id: "mood",
    question: "Какое у вас сегодня настроение?",
    options: [
      { value: "happy", label: "Весёлое" },
      { value: "sad", label: "Грустное" },
      { value: "excited", label: "Взволнованное" },
      { value: "relaxed", label: "Расслабленное" },
      { value: "thoughtful", label: "Задумчивое" },
    ],
  },
  {
    id: "length",
    question: "Сколько у вас времени на просмотр?",
    options: [
      { value: "short", label: "< 30 минут" },
      { value: "medium", label: "30-60 минут" },
      { value: "long", label: "> 60 минут" },
    ],
  },
  {
    id: "era",
    question: "Вы предпочитаете новые или старые сериалы?",
    options: [
      { value: "classic", label: "Классика (до 2000)" },
      { value: "modern", label: "Современные (2000-2015)" },
      { value: "contemporary", label: "Новинки (2015+)" },
      { value: "any", label: "Не важно" },
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

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      // Survey completed
      setSurveyResults(recommendedMovies)
      setShowSurveyModal(false)
      setCurrentQuestion(0)
      // In a real app, we would send the answers to an API
      console.log("Survey answers:", answers)
    }
  }

  return (
    <div className="transform rounded-xl bg-gray-800/50 p-8 shadow-2xl backdrop-blur-sm transition-all h-full">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="h-8 w-8 text-purple-500" />
        <h2 className="text-2xl font-bold">Подбор сериала по вкусу</h2>
      </div>

      {surveyResults ? (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Ваши рекомендации</h3>
            <p className="text-gray-400">Основываясь на ваших предпочтениях, мы думаем, что вам понравятся эти сериалы:</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {surveyResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <button
            onClick={() => {
              setSurveyResults(null)
              setAnswers({})
            }}
            className="mt-6 w-full flex items-center justify-center rounded-lg border border-purple-500 px-4 py-3 font-medium text-purple-400 transition-colors hover:bg-purple-500/10"
          >
            Пройти опрос снова
          </button>
        </div>
      ) : (
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
      )}

      {/* Survey Modal */}
      {showSurveyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowSurveyModal(false)}></div>

          <div className="relative z-10 w-full max-w-md rounded-xl bg-gray-800 p-6 shadow-2xl">
            <button
              onClick={() => setShowSurveyModal(false)}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-1">Movie Preference Quiz</h3>
              <p className="text-gray-400 text-sm">
                Question {currentQuestion + 1} of {surveyQuestions.length}
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

            <div className="flex justify-end">
              <button
                onClick={nextQuestion}
                disabled={!answers[surveyQuestions[currentQuestion].id]}
                className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                <span>{currentQuestion === surveyQuestions.length - 1 ? "Finish" : "Next"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
