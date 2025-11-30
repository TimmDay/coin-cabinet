"use client"

import { AddPlaceView } from "~/components/pages/AddPlaceView"
import { useAuth } from "~/components/providers/auth-provider"
import { AuthRequiredPage } from "~/components/ui/AuthRequiredPage"
import { Loading } from "~/components/ui/Loading"

export default function AddPlacePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return (
      <AuthRequiredPage
        pageTitle="Add Place"
        description="Please sign in to add places to the database."
      />
    )
  }

  return <AddPlaceView />
}
