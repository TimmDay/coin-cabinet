"use client";

import { useAuth } from '../providers/auth-provider'
import { RedRoundButton } from '../ui/RedRoundButton'
import Link from 'next/link'

export function UserMenu() {
  const { user, signOut, loading } = useAuth()

  if (loading) {
    return (
      <div className="text-gray-500 text-sm">
        Loading...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link 
          href="/cc-admin"
          className="text-sm text-gray-700 hover:text-gray-900 underline"
        >
          Admin Login
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700">
        {user.email}
      </span>
      <RedRoundButton
        onClick={signOut}
        className="text-xs px-3 py-1"
      >
        Sign Out
      </RedRoundButton>
    </div>
  )
}
