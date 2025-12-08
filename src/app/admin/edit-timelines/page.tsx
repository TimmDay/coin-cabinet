"use client"

import { EditTimelinesView } from "~/app/admin/edit-timelines/EditTimelinesView"
import { useAuth } from "~/components/providers/auth-provider"
import { AuthRequiredPage } from "~/components/ui/AuthRequiredPage"
import { Loading } from "~/components/ui/Loading"
import { PageTitle } from "~/components/ui/PageTitle"

export default function EditTimelinesPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return (
      <AuthRequiredPage
        pageTitle="Edit Timelines"
        description="Please sign in to edit timelines in the database."
      />
    )
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <PageTitle authPage className="mb-6">
            Edit Timelines
          </PageTitle>
        </div>

        <div className="mx-auto max-w-6xl">
          <EditTimelinesView />
        </div>
      </div>
    </main>
  )
}
