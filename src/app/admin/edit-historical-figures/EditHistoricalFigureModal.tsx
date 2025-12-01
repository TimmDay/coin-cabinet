"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { HistoricalFigure } from "~/database/schema-historical-figures"
import { HistoricalSourcesEditor } from "~/components/forms/HistoricalSourcesEditor"
import {
  FormErrorDisplay,
  handleUnsavedChanges,
  ModalWrapper,
} from "~/components/forms"

// Form data type for editing
type EditFormData = {
  name: string
  full_name: string
  authority: string
  reign_start: string
  reign_end: string
  reign_note: string
  birth: string
  death: string
  dynasty: string
  flavour_text: string
  historical_sources_raw: string
  timeline_id: string
  artifacts_id: string
}

type EditHistoricalFigureModalProps = {
  isOpen: boolean
  onClose: () => void
  figure: HistoricalFigure | null
  onSave: (id: number, updates: Partial<HistoricalFigure>) => Promise<void>
  isSaving?: boolean
}

// Simple validation schema for editing
const editFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  full_name: z.string(),
  authority: z.string().min(1, "Authority is required"),
  reign_start: z.string(),
  reign_end: z.string(),
  reign_note: z.string(),
  birth: z.string(),
  death: z.string(),
  dynasty: z.string(),
  flavour_text: z.string(),
  historical_sources_raw: z.string(),
  timeline_id: z.string(),
  artifacts_id: z.string(),
})

// Helper function to transform figure data for form
const createFigureFormData = (
  figure: HistoricalFigure | null,
): EditFormData => ({
  name: figure?.name ?? "",
  full_name: figure?.full_name ?? "",
  authority: figure?.authority ?? "",
  reign_start: figure?.reign_start?.toString() ?? "",
  reign_end: figure?.reign_end?.toString() ?? "",
  reign_note: figure?.reign_note ?? "",
  birth: figure?.birth?.toString() ?? "",
  death: figure?.death?.toString() ?? "",
  dynasty: figure?.dynasty ?? "",
  flavour_text: figure?.flavour_text ?? "",
  historical_sources_raw: figure?.historical_sources
    ? JSON.stringify(figure.historical_sources)
    : "",
  timeline_id: figure?.timeline_id?.join(", ") ?? "",
  artifacts_id: figure?.artifacts_id?.join(", ") ?? "",
})

export function EditHistoricalFigureModal({
  isOpen,
  onClose,
  figure,
  onSave,
  isSaving = false,
}: EditHistoricalFigureModalProps) {
  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    setError,
    clearErrors,
    setValue,
    watch,
  } = useForm<EditFormData>({
    resolver: zodResolver(editFormSchema),
    values: createFigureFormData(figure),
  })

  // Helper functions for parsing
  const parseNumber = (str: string): number | null => {
    if (!str || str.trim() === "") return null
    const num = parseInt(str, 10)
    return isNaN(num) ? null : num
  }

  const parseNumberArray = (str: string): number[] | null => {
    if (!str || str.trim() === "") return null
    const arr = str
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map((s) => parseInt(s, 10))
      .filter((n) => !isNaN(n))
    return arr.length > 0 ? arr : null
  }

  const parseHistoricalSources = (str: string) => {
    if (!str || str.trim() === "") return []
    try {
      return JSON.parse(str)
    } catch {
      return []
    }
  }

  const onSubmit = async (data: EditFormData) => {
    if (!figure) return

    clearErrors()

    const updates: Partial<HistoricalFigure> = {
      name: data.name,
      full_name: data.full_name || null,
      authority: data.authority,
      reign_start: parseNumber(data.reign_start),
      reign_end: parseNumber(data.reign_end),
      reign_note: data.reign_note || null,
      birth: parseNumber(data.birth),
      death: parseNumber(data.death),
      dynasty: data.dynasty || null,
      flavour_text: data.flavour_text || null,
      historical_sources: parseHistoricalSources(data.historical_sources_raw),
      timeline_id: parseNumberArray(data.timeline_id),
      artifacts_id: parseNumberArray(data.artifacts_id),
    }

    try {
      await onSave(figure.id, updates)
      onClose() // Close modal after successful save
    } catch (error) {
      console.error("Failed to save figure:", error)
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save changes. Please try again.",
      })
    }
  }

  const handleClose = () => handleUnsavedChanges(isDirty, onClose)

  if (!isOpen || !figure) return null

  const inputClass =
    "w-full rounded-md border border-slate-600 bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none px-3 py-2 transition-colors"
  const textareaClass = `${inputClass} min-h-[100px] resize-y`
  const labelClass = "mb-2 block text-sm font-medium text-slate-300"

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title={`Edit Historical Figure: ${figure.name}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
        <FormErrorDisplay errors={errors} />

        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Name *</label>
            <input
              type="text"
              {...register("name")}
              className={inputClass}
              placeholder="Enter name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              {...register("full_name")}
              className={inputClass}
              placeholder="Enter full name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Authority/Title *</label>
            <input
              type="text"
              {...register("authority")}
              className={inputClass}
              placeholder="Emperor, Augusta, Caesar..."
            />
            {errors.authority && (
              <p className="mt-1 text-sm text-red-600">
                {errors.authority.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Dynasty</label>
            <input
              type="text"
              {...register("dynasty")}
              className={inputClass}
              placeholder="Julio-Claudian, Flavian..."
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <label className={labelClass}>Birth Year</label>
            <input
              type="number"
              {...register("birth")}
              className={inputClass}
              placeholder="e.g., 63"
            />
          </div>

          <div>
            <label className={labelClass}>Death Year</label>
            <input
              type="number"
              {...register("death")}
              className={inputClass}
              placeholder="e.g., 14"
            />
          </div>

          <div>
            <label className={labelClass}>Reign Start</label>
            <input
              type="number"
              {...register("reign_start")}
              className={inputClass}
              placeholder="e.g., 27"
            />
          </div>

          <div>
            <label className={labelClass}>Reign End</label>
            <input
              type="number"
              {...register("reign_end")}
              className={inputClass}
              placeholder="e.g., 14"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Reign Note</label>
          <input
            type="text"
            {...register("reign_note")}
            className={inputClass}
            placeholder="Co-emperor with..."
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            {...register("flavour_text")}
            className={textareaClass}
            placeholder="Historical significance and context..."
          />
        </div>

        {/* Historical Sources */}
        <HistoricalSourcesEditor
          value={watch("historical_sources_raw") ?? ""}
          onChange={(value) =>
            setValue("historical_sources_raw", value, { shouldDirty: true })
          }
          error={errors.historical_sources_raw?.message}
        />

        {/* IDs */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Timeline IDs</label>
            <input
              type="text"
              {...register("timeline_id")}
              className={inputClass}
              placeholder="1, 2, 3 (comma separated)"
            />
          </div>

          <div>
            <label className={labelClass}>Artifact IDs</label>
            <input
              type="text"
              {...register("artifacts_id")}
              className={inputClass}
              placeholder="1, 2, 3 (comma separated)"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={!isDirty || isSaving}
            className="flex-1 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="flex-1 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </ModalWrapper>
  )
}
