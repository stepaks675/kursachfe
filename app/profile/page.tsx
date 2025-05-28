"use client"

import { useState, useEffect } from "react"
import { User, Film, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { useSession } from "next-auth/react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { redirect } from "next/navigation"
import { getUserPreferences, UserPreferences } from "@/lib/actions/user"
import { getRecommendationHistory } from "@/lib/actions/reccomendations"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [currentPage, setCurrentPage] = useState(0)
  const [userPrefs, setUserPrefs] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recommendationHistory, setRecommendationHistory] = useState<any[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  

  
  const genreLabels: Record<string, string> = {
    action: "Боевики",
    adventure: "Приключения",
    animation: "Анимация",
    comedy: "Комедии",
    crime: "Криминальные",
    documentary: "Документальные",
    drama: "Драмы",
    family: "Семейные",
    fantasy: "Фэнтези",
    history: "Исторические",
    horror: "Ужасы",
    music: "Музыкальные",
    mystery: "Детективы",
    romance: "Романтические",
    scifi: "Научная фантастика",
    thriller: "Триллеры",
    war: "Военные",
    western: "Вестерны"
  }

  const timePeriodLabels: Record<string, string> = {
    "1990-е": "1990-е",
    "2000-е": "2000-е",
    "2010-е": "2010-е",
    "2020-е": "2020-е",
    "any": "Любой период"
  }

  const durationLabels: Record<string, string> = {
    "до 60": "до 60",
    "60-120": "60-120",
    "120-180": "120-180",
    "180-210": "180-210",
    "any": "Любая продолжительность"
  }
  
  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoading(true)
        setHistoryLoading(true)
        
        const [prefsResult, historyResult] = await Promise.all([
          getUserPreferences(),
          getRecommendationHistory()
        ])
        
        if (prefsResult.success && prefsResult.data) {
          setUserPrefs(prefsResult.data)
        } else if (prefsResult.error) {
          setError(prefsResult.error)
        }

        if (historyResult.success && historyResult.history) {
          setRecommendationHistory(historyResult.history)
        }
      } catch (err) {
        console.error("Failed to load user data:", err)
        setError("Не удалось загрузить данные пользователя")
      } finally {
        setIsLoading(false)
        setHistoryLoading(false)
      }
    }

    if (status === "authenticated") {
      loadUserData()
    }
  }, [status])

  const userQuestions = userPrefs ? [
    { 
      id: 1, 
      question: "Ваш любимый жанр фильмов?", 
      answer: userPrefs.genres?.map(genre => genreLabels[genre] || genre).join(", ") || "Не указано" 
    },
    { 
      id: 2, 
      question: "Предпочитаемый год выпуска?", 
      answer: timePeriodLabels[userPrefs.period || ""] || userPrefs.period || "Не указано" 
    },
    { 
      id: 3, 
      question: "Продолжительность серии?", 
      answer: durationLabels[userPrefs.duration || ""] || userPrefs.duration || "Не указано" 
    },
  ] : []

  if (status === "unauthenticated") {
    redirect("/login")
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const itemsPerPage = 3
  const totalPages = Math.ceil(recommendationHistory.length / itemsPerPage)
  const paginatedRecommendations = recommendationHistory.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  )

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))
  }

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/movies-bg.jpg')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90"></div>
      </div>

      <div className="relative z-10">
        <Navbar session={session} />

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">

            
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-20 w-20 rounded-full bg-purple-600 flex items-center justify-center">
                    <User className="h-10 w-10" />
                  </div>
                  <h1 className="text-3xl font-bold">Профиль пользователя</h1>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-400">Имя пользователя</label>
                    </div>
                    
                    <div className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2">
                      {session?.user?.name || "Не указано"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl font-bold">Выбранные предпочтения</h2>
                </div>
                
                {error ? (
                  <div className="bg-red-500/20 text-red-300 p-4 rounded-lg">
                    {error}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userQuestions.map((item) => (
                      <div key={item.id} className="bg-gray-700/50 rounded-lg p-4">
                        <p className="text-gray-300 text-sm">{item.question}</p>
                        <p className="font-medium text-white">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Recommendation History with Pagination */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <Clock className="h-4 w-4" />
                    </div>
                    <h2 className="text-xl font-bold">История рекомендаций</h2>
                  </div>
                  
                  {/* Pagination Controls */}
                  {recommendationHistory.length > itemsPerPage && (
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={goToPrevPage}
                        disabled={currentPage === 0}
                        className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="text-sm">{currentPage + 1} / {totalPages}</span>
                      <button 
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages - 1}
                        className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
                
                {historyLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : recommendationHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Film className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>История рекомендаций пуста</p>
                    <p className="text-sm">Пройдите опрос или найдите похожие сериалы, чтобы увидеть рекомендации здесь</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {paginatedRecommendations.map((item) => (
                      <div key={item.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-purple-500 transition-colors">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Film className="h-5 w-5 text-purple-400 flex-shrink-0" />
                            <h3 className="font-semibold text-white text-lg">{item.movieTitle}</h3>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-400 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString('ru-RU') : 'Дата неизвестна'}
                            </span>
                          </div>
                          
                          {item.movieDescription && (
                            <div className="text-gray-300 text-sm leading-relaxed">
                              <p className="line-clamp-3">{item.movieDescription}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
