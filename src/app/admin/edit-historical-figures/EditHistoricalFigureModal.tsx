"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { HistoricalFigure } from "~/database/schema-historical-figures"
import { HistoricalSourcesEditor } from "~/components/forms/HistoricalSourcesEditor"
import {
  FormErrorDisplay,
  handleUnsavedChanges,
  ModalWrapper,
} from "~/components/forms"

import {
  historicalFigureFormInputSchema,
  historicalFigureFormSchema,
  type HistoricalFigureFormInputData,
} from "~/lib/validations/historical-figure-form"
import type { BaseEditModalProps } from "~/lib/types/form-patterns"

type EditHistoricalFigureModalProps = BaseEditModalProps<HistoricalFigure>

// Helper function to transform figure data for form
const createFigureFormData = (
  figure: HistoricalFigure | null,
): HistoricalFigureFormInputData => ({
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
  historical_sources: figure?.historical_sources
    ? JSON.stringify(figure.historical_sources)
    : "",
  timeline_id: figure?.timeline_id?.join(", ") ?? "",
  artifacts_id: figure?.artifacts_id?.join(", ") ?? "",
  places_id: figure?.places_id?.join(", ") ?? "",
})

export function EditHistoricalFigureModal({
  isOpen,
  onClose,
  entity: figure,
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
    reset,
  } = useForm<HistoricalFigureFormInputData>({
    resolver: zodResolver(historicalFigureFormInputSchema),
    defaultValues: createFigureFormData(null),
  })

  // Reset form when figure changes
  useEffect(() => {
    if (figure) {
      const formData = createFigureFormData(figure)
      reset(formData)
    }
  }, [figure, reset])

  const onSubmit = async (data: HistoricalFigureFormInputData) => {
    clearErrors()

    const isCreateMode = !figure

    // Use the schema transformation to get properly parsed data
    const transformedData = historicalFigureFormSchema.parse(data)

    const updates: Partial<HistoricalFigure> = {
      name: transformedData.name,
      full_name: transformedData.full_name ?? null,
      authority: transformedData.authority,
      reign_start: transformedData.reign_start,
      reign_end: transformedData.reign_end,
      reign_note: transformedData.reign_note ?? null,
      birth: transformedData.birth,
      death: transformedData.death,
      dynasty: transformedData.dynasty ?? null,
      flavour_text: transformedData.flavour_text ?? null,
      historical_sources: transformedData.historical_sources,
      timeline_id: transformedData.timeline_id,
      artifacts_id: transformedData.artifacts_id,
      places_id: transformedData.places_id,
    }

    try {
      if (isCreateMode) {
        await onSave(0, updates) // Use 0 as dummy id for create
      } else if (figure) {
        await onSave(figure.id, updates)
      }
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

  if (!isOpen) return null

  const inputClass =
    "w-full rounded-md border border-slate-600 bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none px-3 py-2 transition-colors"
  const textareaClass = `${inputClass} min-h-[100px] resize-y`
  const labelClass = "mb-2 block text-sm font-medium text-slate-300"

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title={
        figure?.name
          ? `Edit Historical Figure: ${figure.name}`
          : "Add New Historical Figure"
      }
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
              {...register("birth", {
                setValueAs: (v) =>
                  v === "" || v == null ? undefined : Number(v),
              })}
              className={inputClass}
              placeholder="e.g., 63"
            />
          </div>

          <div>
            <label className={labelClass}>Death Year</label>
            <input
              type="number"
              {...register("death", {
                setValueAs: (v) =>
                  v === "" || v == null ? undefined : Number(v),
              })}
              className={inputClass}
              placeholder="e.g., 14"
            />
          </div>

          <div>
            <label className={labelClass}>Reign Start</label>
            <input
              type="number"
              {...register("reign_start", {
                setValueAs: (v) =>
                  v === "" || v == null ? undefined : Number(v),
              })}
              className={inputClass}
              placeholder="e.g., 27"
            />
          </div>

          <div>
            <label className={labelClass}>Reign End</label>
            <input
              type="number"
              {...register("reign_end", {
                setValueAs: (v) =>
                  v === "" || v == null ? undefined : Number(v),
              })}
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
          value={watch("historical_sources") ?? ""}
          onChange={(value) =>
            setValue("historical_sources", value, { shouldDirty: true })
          }
          error={errors.historical_sources?.message}
        />

        {/* Places */}
        <div>
          <label className={labelClass}>Places</label>
          <input
            type="text"
            {...register("places_id")}
            className={inputClass}
            placeholder="1, 2, 3 (comma separated)"
          />
        </div>

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
