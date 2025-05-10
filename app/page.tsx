//TODO: move to unauthenticated page, implement auth, add middleware
"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useState } from "react"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
    }, 3000)
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
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Welcome to Kin4ik</h1>
            <p className="text-gray-400">Please sign in to continue</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}
            
            {success && (
              <div className="text-green-400 text-sm text-center">Successfully signed in!</div>
            )}

            <button
              type="submit"
              className="group flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-500"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="text-center">
            <Link
              href="/register"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Don't have an account? Register here
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Kin4ik. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
