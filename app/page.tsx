"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import SessionInfo from "./components/SessionInfo"

export default function Main() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/movies-bg.jpg')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90"></div>
      </div>

      <div className="w-full max-w-4xl transform rounded-xl bg-gray-800/50 p-8 shadow-2xl backdrop-blur-sm transition-all relative z-10">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Welcome to Your Dashboard</h1>
            <p className="text-gray-400">Your personalized movie recommendations will appear here</p>
          </div>

          <div className="mb-6">
            <SessionInfo />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700/50 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold">Recommended for You</h2>
              <p className="text-gray-400">Based on your preferences, we'll recommend movies here</p>
              <div className="bg-gray-600/50 h-40 rounded-lg flex items-center justify-center">
                <p className="text-gray-400 italic">Your recommendations will appear here</p>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold">Your Preferences</h2>
              <p className="text-gray-400">Your movie preferences that you selected during registration</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Favorite Genre:</span>
                  <span>Action</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Watching Frequency:</span>
                  <span>Weekly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Preferred Language:</span>
                  <span>Original</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Kin4ik. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 