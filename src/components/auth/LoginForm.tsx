"use client"

import { useState } from "react"
import { useAuth } from "../providers/auth-provider"
import { RoundButton } from "../ui/RoundButton"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password)

      if (error) {
        setMessage(error.message ?? "An error occurred")
      } else if (isSignUp) {
        setMessage("Check your email for the confirmation link!")
      }
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "An unexpected error occurred",
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded border border-slate-600 bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-colors"
  const labelClass = "block text-sm font-medium text-slate-300 mb-1"

  return (
    <div className="somnus-card mx-auto w-full max-w-md p-8">
      <h2 className="coin-title mb-6 text-center text-2xl font-bold">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="Enter your password"
            required
          />
        </div>

        {message && (
          <div
            className={`rounded p-3 text-sm ${
              message.includes("Check your email")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <RoundButton
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-full"
        >
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
        </RoundButton>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-sm text-amber-300 underline transition-colors hover:text-amber-200"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </button>
      </form>
    </div>
  )
}
