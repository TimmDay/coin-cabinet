"use client"

import { useState } from "react"
import { ViewModeControls } from "~/components/ui/ViewModeControls"
import { SetPageClient } from "./SetPageClient"

type SetInfo = {
  title: string
  description: string
  setFilter: string
}

type SetPageWrapperProps = {
  setInfo: SetInfo
  setSlug: string
}

export function SetPageWrapper({ setInfo, setSlug }: SetPageWrapperProps) {
  const [viewMode, setViewMode] = useState<"obverse" | "reverse" | "both">(
    "obverse",
  )

  return (
    <>
      <ViewModeControls viewMode={viewMode} onViewModeChange={setViewMode} />
      <SetPageClient setInfo={setInfo} setSlug={setSlug} viewMode={viewMode} />
    </>
  )
}
