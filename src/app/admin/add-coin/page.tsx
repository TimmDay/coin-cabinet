"use client"

import { AddCoinView } from "~/app/admin/add-coin/AddCoinView"
import { useAuth } from "~/components/providers/auth-provider"
import { AuthRequiredPage } from "~/components/ui/AuthRequiredPage"
import { Loading } from "~/components/ui/Loading"
import { PageTitle } from "~/components/ui/PageTitle"

export default function AddCoinPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return (
      <AuthRequiredPage
        pageTitle="Add Coin"
        description="Please sign in to add coins to your collection."
      />
    )
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <PageTitle authPage className="mb-6">
            Add Coin
          </PageTitle>
        </div>

        <AddCoinView />
      </div>
    </main>
  )
}
