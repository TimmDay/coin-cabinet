"use client"

import { EditPlacesView } from "./EditPlacesView"
import { useAuth } from "~/components/providers/auth-provider"
import { AuthRequiredPage } from "~/components/ui/AuthRequiredPage"
import { Loading } from "~/components/ui/Loading"
import { PageTitle } from "~/components/ui/PageTitle"

export default function EditPlacesPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return (
      <AuthRequiredPage
        pageTitle="Edit Places"
        description="Please sign in to edit places in the database."
      />
    )
  }

  return (
    <main className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <PageTitle authPage className="mb-6">
            Edit Places
          </PageTitle>
        </div>

        <div className="mx-auto max-w-6xl">
          <EditPlacesView />
        </div>
      </div>
    </main>
  )
}
