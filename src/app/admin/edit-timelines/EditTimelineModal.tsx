"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  FormActions,
  ModalWrapper,
  TimelineEventsEditor,
} from "~/components/forms"
import type { Timeline, TimelineFormData } from "~/database/schema-timelines"
import type { Event } from "~/data/timelines/types"

type FormData = {
  name: string
  timeline_events: string // JSON string representation of the timeline events
}

type EditTimelineModalProps = {
  isOpen: boolean
  onClose: () => void
  timeline: Timeline | null
  onSave: (
    id: number,
    updates: Partial<Timeline> | TimelineFormData,
  ) => Promise<void>
  isSaving?: boolean
}

// Helper function to transform timeline data for form
const createTimelineFormData = (timeline: Timeline | null): FormData => {
  return {
    name: timeline?.name ?? "",
    timeline_events: timeline?.timeline
      ? JSON.stringify(timeline.timeline)
      : "",
  }
}

export function EditTimelineModal({
  isOpen,
  onClose,
  timeline,
  onSave,
  isSaving = false,
}: EditTimelineModalProps) {
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: createTimelineFormData(timeline),
  })

  // Reset form when timeline data changes (enhanced for mobile JSONB updates)
  useEffect(() => {
    if (isOpen && timeline) {
      const formData = createTimelineFormData(timeline)
      reset(formData)
      setError(null)

      // On mobile, ensure the form values are properly set with a small delay
      if (
        typeof window !== "undefined" &&
        /Mobi|Android/i.test(navigator.userAgent)
      ) {
        setTimeout(() => {
          reset(formData)
        }, 50)
      }
    }
  }, [
    timeline?.updated_at,
    timeline?.id,
    timeline?.timeline,
    isOpen,
    reset,
    timeline,
  ])

  const onSubmit = async (data: FormData) => {
    setError(null)

    try {
      let parsedTimeline: Event[] = []

      // Parse the timeline events if provided
      if (data.timeline_events?.trim()) {
        parsedTimeline = JSON.parse(data.timeline_events) as Event[]

        // Validate that each event has coordinates
        const eventsWithoutCoordinates = parsedTimeline.filter(
          (event, index) => {
            const hasLat = typeof event.lat === "number" && !isNaN(event.lat)
            const hasLng = typeof event.lng === "number" && !isNaN(event.lng)
            return !hasLat || !hasLng
          },
        )

        if (eventsWithoutCoordinates.length > 0) {
          const eventNames = eventsWithoutCoordinates
            .map((e) => e.name || "Unnamed event")
            .join(", ")
          setError(
            `All events must have valid coordinates (latitude and longitude). Missing coordinates for: ${eventNames}`,
          )
          return
        }

        // Sort events chronologically by year
        parsedTimeline.sort((a, b) => {
          const yearA = a.year ?? 0
          const yearB = b.year ?? 0
          return yearA - yearB
        })
      }

      const timelineData: TimelineFormData = {
        name: data.name.trim(),
        timeline: parsedTimeline,
      }

      const id = timeline?.id ?? 0 // For create operations, we pass 0
      await onSave(id, timelineData)

      if (!timeline) {
        // Reset form for create mode
        reset(createTimelineFormData(null))
      } else {
        // For edit mode, close the modal and let the useEffect handle the reset with updated data
        // The modal will be recreated with fresh data due to the key including updated_at
      }

      onClose()
    } catch (err) {
      console.error("Save error:", err)
      setError(err instanceof Error ? err.message : "Failed to save timeline")
    }
  }

  const modalTitle = timeline
    ? `Edit Timeline: ${timeline.name}`
    : "Create New Timeline"

  // Handle modal close with unsaved changes warning
  const handleClose = () => {
    if (isDirty) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close without saving? All changes will be lost.",
      )
      if (!confirmClose) return
    }
    onClose()
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose} title={modalTitle}>
      <div className="artemis-card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Timeline Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "Timeline name is required",
                minLength: { value: 1, message: "Name must not be empty" },
              })}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., first-jewish-war, macrinus"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>
          {/* Timeline Events Editor */}
          <TimelineEventsEditor
            value={watch("timeline_events") ?? ""}
            onChange={(value: string) =>
              setValue("timeline_events", value, { shouldDirty: true })
            }
            error={errors.timeline_events?.message}
          />{" "}
          {/* Error Display */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {/* Unsaved Changes Warning */}
          {isDirty && (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    You have unsaved changes. Make sure to save your timeline to
                    preserve any added, modified, or deleted events.
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Form Actions */}
          <FormActions
            onCancel={handleClose}
            isDirty={isDirty}
            isSaving={isSaving}
            saveLabel={timeline ? "Update Timeline" : "Create Timeline"}
          />
        </form>
      </div>
    </ModalWrapper>
  )
}
