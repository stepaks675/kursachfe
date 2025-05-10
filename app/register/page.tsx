//TODO: improve design, do right questions, add validation, add backend
"use client"
import Link from "next/link"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { useState } from "react"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    favoriteGenre: "",
    watchFrequency: "",
    preferredLanguage: "",
    favoriteActors: [] as string[],
    favoriteMovies: [] as string[],
    moviePreferences: "",
  })
  const [error, setError] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedActors, setSelectedActors] = useState<string[]>([])

  const questions = [
    {
      type: "single",
      question: "Какой жанр фильмов вы предпочитаете?",
      options: [
        { value: "action", label: "Боевики" },
        { value: "comedy", label: "Комедии" },
        { value: "drama", label: "Драмы" },
        { value: "horror", label: "Ужасы" },
        { value: "sci-fi", label: "Фантастика" },
      ],
      name: "favoriteGenre"
    },
    {
      type: "multi",
      question: "Выберите ваших любимых актеров (можно выбрать несколько):",
      options: [
        { value: "tom_hanks", label: "Том Хэнкс" },
        { value: "leonardo_dicaprio", label: "Леонардо Ди Каприо" },
        { value: "meryl_streep", label: "Мерил Стрип" },
        { value: "brad_pitt", label: "Брэд Питт" },
        { value: "scarlett_johansson", label: "Скарлетт Йоханссон" },
        { value: "ryan_gosling", label: "Райан Гослинг" },
      ],
      name: "favoriteActors"
    },
    {
      type: "text",
      question: "Расскажите о ваших предпочтениях в кино (любимые фильмы, что ищете в фильмах и т.д.):",
      placeholder: "Например: люблю фильмы с неожиданным финалом, предпочитаю европейское кино...",
      name: "moviePreferences"
    },
    {
      type: "single",
      question: "Как часто вы смотрите фильмы?",
      options: [
        { value: "daily", label: "Ежедневно" },
        { value: "weekly", label: "Раз в неделю" },
        { value: "monthly", label: "Раз в месяц" },
        { value: "rarely", label: "Редко" },
      ],
      name: "watchFrequency"
    },
    {
      type: "single",
      question: "На каком языке вы предпочитаете смотреть фильмы?",
      options: [
        { value: "russian", label: "Русский" },
        { value: "english", label: "Английский" },
        { value: "original", label: "Оригинальный" },
        { value: "any", label: "Любой" },
      ],
      name: "preferredLanguage"
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleMultiSelect = (value: string) => {
    setSelectedActors(prev => {
      const newSelection = prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
      
      setFormData(prev => ({
        ...prev,
        favoriteActors: newSelection
      }))
      
      return newSelection
    })
  }

  const handleQuestionAnswer = (value: string) => {
    const currentQ = questions[currentQuestion]
    
    if (currentQ.type === "single") {
      setFormData(prev => ({
        ...prev,
        [currentQ.name]: value
      }))
    }
  }

  const handleNextQ = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setStep(3)
    }
  }

  const handleBackQ = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    } else {
      setStep(1)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const renderQuestion = () => {
    const currentQ = questions[currentQuestion]

    switch (currentQ.type) {
      case "single":
        return (
          <div className="space-y-3">
            {currentQ.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleQuestionAnswer(option.value)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  formData[currentQ.name as keyof typeof formData] === option.value
                    ? "bg-purple-600 hover:bg-purple-500"
                    : "bg-gray-600/50 hover:bg-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )

      case "multi":
        return (
          <div className="space-y-3">
            {currentQ.options?.map((option) => (
              <label
                key={option.value}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  selectedActors.includes(option.value)
                    ? "bg-purple-600/50 hover:bg-purple-600"
                    : "bg-gray-600/50 hover:bg-gray-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedActors.includes(option.value)}
                  onChange={() => handleMultiSelect(option.value)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )

      case "text":
        return (
          <div className="space-y-4">
            <textarea
              value={formData.moviePreferences}
              onChange={handleInputChange}
              name="moviePreferences"
              placeholder={currentQ.placeholder}
              className="w-full h-32 px-4 py-3 rounded-lg bg-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        )
    }
  }

  const validateStep1 = () => {
    if (!formData.email || !formData.username || !formData.password) {
      setError("Please fill in all fields")
      return false
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters")
      return false
    }
    return true
  }

  const handleNext = () => {
    setError("")
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handleBack = () => {
    setStep(1)
    setError("")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/movies-bg.jpg')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90"></div>
      </div>

      <div className="w-full max-w-md transform rounded-xl bg-gray-800/50 p-8 shadow-2xl backdrop-blur-sm transition-all relative z-10">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Create Account</h1>
            <p className="text-gray-400">
              {step === 1 ? "Fill in your details" : "Tell us about your preferences"}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full rounded-lg bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded-lg bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                className="group flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-500"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          ) : step === 2 ? (
            <div className="space-y-6">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-6 space-y-6">
                <h3 className="text-xl font-medium text-center">
                  {questions[currentQuestion].question}
                </h3>
                {renderQuestion()}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleBackQ}
                  className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </button>
                <span className="text-sm text-gray-400">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <button
                  onClick={handleNextQ}
                  className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
                >
                  {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Registration Complete!</h2>
              <p className="text-gray-400">Thank you for completing the registration process.</p>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-500"
              >
                Go to Home
                <ArrowRight className="ml-2 h-4 w-4 opacity-70" />
              </Link>
            </div>
          )}

          {step === 1 && (
            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Already have an account? Sign in here
              </Link>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Kin4ik. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 