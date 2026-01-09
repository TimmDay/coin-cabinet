"use client"

import { useEffect, useState } from "react"
import { PageTitle } from "~/components/ui/PageTitle"
import {
  AVAILABLE_FEATURE_FLAGS,
  type FeatureFlagConfig,
} from "~/lib/feature-flags"
import { clearFeatureFlags, setFeatureFlag } from "~/lib/hooks/useFeatureFlag"

export default function FeatureFlagsPage() {
  const [enabledFlags, setEnabledFlags] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load current feature flag status from localStorage
  useEffect(() => {
    const loadFeatureFlags = () => {
      if (typeof window === "undefined") return

      try {
        const stored = localStorage.getItem("feat-flags")
        const storedFlags = stored
          ? (JSON.parse(stored) as Record<string, boolean>)
          : {}
        setEnabledFlags(storedFlags)
      } catch (error) {
        console.error("Error loading feature flags:", error)
        setEnabledFlags({})
      }
      setIsLoading(false)
    }

    loadFeatureFlags()
  }, [])

  const handleToggleFlag = (flagName: string, enabled: boolean) => {
    setFeatureFlag(flagName as "dev" | "show-hidden-coins", enabled)
    setEnabledFlags((prev) => ({
      ...prev,
      [flagName]: enabled,
    }))
  }

  const handleClearAllFlags = () => {
    clearFeatureFlags()
    setEnabledFlags({})
  }

  if (isLoading) {
    return (
      <main className="bg-background min-h-screen p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <PageTitle subtitle="Manage development and experimental features">
            Feature Flags
          </PageTitle>
          <div className="text-muted-foreground mt-8 text-center">
            Loading feature flags...
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-background min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <PageTitle subtitle="Manage development and experimental features">
          Feature Flags
        </PageTitle>

        <div className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              Enable or disable experimental flags. Hit refresh for it to take
              effect.
            </p>
            <button
              onClick={handleClearAllFlags}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2 transition-colors"
            >
              Clear All Flags
            </button>
          </div>

          <div className="space-y-4">
            {AVAILABLE_FEATURE_FLAGS.map((flag: FeatureFlagConfig) => {
              const isEnabled = enabledFlags[flag.name] === true

              return (
                <div
                  key={flag.name}
                  className="somnus-card flex items-center justify-between p-6"
                >
                  <div className="flex-1">
                    <h3 className="text-foreground text-lg font-semibold">
                      {flag.displayName}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {flag.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm font-medium">Status:</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          isEnabled
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                        }`}
                      >
                        {isEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  <div className="ml-6">
                    <button
                      onClick={() => handleToggleFlag(flag.name, !isEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                        isEnabled
                          ? "bg-green-500 focus:ring-green-500"
                          : "focus:ring-primary bg-gray-200 dark:bg-gray-700"
                      }`}
                      role="switch"
                      aria-checked={isEnabled}
                      aria-label={`Toggle ${flag.displayName}`}
                      title={`${isEnabled ? "Disable" : "Enable"} ${flag.displayName}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="somnus-card mt-8 p-6">
            <h3 className="text-foreground mb-3 text-lg font-semibold">
              Alternative Activation
            </h3>
            <p className="text-muted-foreground text-sm">
              Feature flags can also be enabled by adding{" "}
              <code className="bg-muted text-foreground rounded px-1 py-0.5">
                ?feat=flagname
              </code>{" "}
              to any URL. For example:{" "}
              <code className="bg-muted text-foreground rounded px-1 py-0.5">
                ?feat=dev
              </code>
            </p>
          </div>

          <div className="somnus-card mt-8 p-6">
            <h3 className="text-foreground mb-3 text-lg font-semibold">
              Always Clean Up
            </h3>
            <p className="text-muted-foreground text-sm">
              If a feature has been shipped or deleted - clean up! Periodically
              search the code base for
              <code className="bg-muted text-foreground rounded px-1 py-0.5">
                FeatureFlag
              </code>{" "}
              to find all instances in which the hook has been used.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
