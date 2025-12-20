"use client"

import { EditArtifactsView } from "~/app/admin/edit-artifacts/EditArtifactsView"
import { useAuth } from "~/components/providers/auth-provider"
import { AuthRequiredPage } from "~/components/ui/AuthRequiredPage"
import { Loading } from "~/components/ui/Loading"
import { PageTitle } from "~/components/ui/PageTitle"

export default function EditArtifactsPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return (
      <AuthRequiredPage
        pageTitle="Edit Artifacts"
        description="Please sign in to edit artifacts in the database."
      />
    )
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <PageTitle authPage className="mb-6">
            Edit Artifacts
          </PageTitle>
        </div>

        <div className="mx-auto max-w-6xl">
          <EditArtifactsView />
        </div>
      </div>
    </main>
  )
}
