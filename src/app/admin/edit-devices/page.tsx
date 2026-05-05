"use client"

import { EditDevicesView } from "~/app/admin/edit-devices/EditDevicesView"
import { useAuth } from "~/components/providers/auth-provider"
import { AuthRequiredPage } from "~/components/ui/AuthRequiredPage"
import { Loading } from "~/components/ui/Loading"
import { PageTitle } from "~/components/ui/PageTitle"

export default function EditDevicesPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return (
      <AuthRequiredPage
        pageTitle="Manage Devices"
        description="Please sign in to manage devices in the database."
      />
    )
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <PageTitle authPage className="mb-6">
            Manage Devices
          </PageTitle>
        </div>

        <div className="mx-auto max-w-6xl">
          <EditDevicesView />
        </div>
      </div>
    </main>
  )
}
