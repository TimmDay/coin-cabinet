"use client"

import { EditMintsView } from "~/app/admin/edit-mints/EditMintsView"
import { useAuth } from "~/components/providers/auth-provider"
import { AuthRequiredPage } from "~/components/ui/AuthRequiredPage"
import { Loading } from "~/components/ui/Loading"
import { PageTitle } from "~/components/ui/PageTitle"

export default function EditMintsPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return (
      <AuthRequiredPage
        pageTitle="Edit Mints"
        description="Please sign in to edit mints in the database."
      />
    )
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <PageTitle authPage className="mb-6">
            Edit Mints
          </PageTitle>
        </div>

        <div className="mx-auto max-w-6xl">
          <EditMintsView />
        </div>
      </div>
    </main>
  )
}
