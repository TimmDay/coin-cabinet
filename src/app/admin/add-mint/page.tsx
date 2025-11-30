"use client"

import { AddMintView } from "~/app/admin/add-mint/AddMintView"
import { useAuth } from "~/components/providers/auth-provider"
import { AuthRequiredPage } from "~/components/ui/AuthRequiredPage"
import { Loading } from "~/components/ui/Loading"
import { PageTitle } from "~/components/ui/PageTitle"

export default function AddMintPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return (
      <AuthRequiredPage
        pageTitle="Add Mint"
        description="Please sign in to add mints to the database."
      />
    )
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <PageTitle authPage className="mb-6">
            Add Mint
          </PageTitle>
        </div>

        <AddMintView />
      </div>
    </main>
  )
}
