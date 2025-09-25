"use client";

import { useState } from 'react'
import { useAuth } from '../providers/auth-provider'
import { RedRoundButton } from '../ui/RedRoundButton'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password)

      if (error) {
        setMessage(error.message ?? 'An error occurred')
      } else if (isSignUp) {
        setMessage('Check your email for the confirmation link!')
      }
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-3 py-2 rounded border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
  const labelClass = "block text-sm font-medium text-white mb-1"

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-white/10 p-6 backdrop-blur-sm">
      <h2 className="mb-6 text-2xl font-bold text-white text-center">
        {isSignUp ? 'Sign Up' : 'Sign In'}
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
          <div className={`text-sm p-3 rounded ${
            message.includes('Check your email') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <RedRoundButton
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </RedRoundButton>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-sm text-purple-200 hover:text-purple-100 underline"
        >
          {isSignUp 
            ? 'Already have an account? Sign in' 
            : "Don't have an account? Sign up"
          }
        </button>
      </form>
    </div>
  )
}
