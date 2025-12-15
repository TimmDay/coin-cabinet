"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFormPersistence } from "~/hooks/useFormPersistence"
import type { HistoricalFigure } from "~/database/schema-historical-figures"
import { HistoricalSourcesEditor } from "~/components/forms/HistoricalSourcesEditor"
import {
  FormErrorDisplay,
  FormActions,
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
  altNames: figure?.altNames?.join(", ") ?? "",
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

  const isCreateMode = !figure

  // Form persistence for mobile browser resilience
  const { clearSavedData } = useFormPersistence({
    key: isCreateMode
      ? "create-historical-figure"
      : `edit-historical-figure-${figure?.id}`,
    form: { watch, reset },
    enabled: isOpen,
  })

  // Reset form when figure changes (but only for edit mode to avoid overriding persistence)
  useEffect(() => {
    if (figure && !isCreateMode) {
      const formData = createFigureFormData(figure)
      reset(formData)
    }
    // Don't reset for create mode - let persistence handle it
  }, [figure, isCreateMode, reset])

  // Initialize create mode with defaults only if no saved data exists
  useEffect(() => {
    if (isCreateMode && isOpen && typeof window !== "undefined") {
      const savedData = localStorage.getItem("form_create-historical-figure")
      if (!savedData) {
        // Only set defaults if there's no saved data
        reset(createFigureFormData(null))
      }
    }
  }, [isCreateMode, isOpen, reset])

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
      altNames: transformedData.altNames as string[] | null,
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
      // Clear saved form data on successful save
      clearSavedData()
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

  const handleClose = () => {
    const closeWithCleanup = () => {
      if (isCreateMode) {
        clearSavedData()
      }
      onClose()
    }
    handleUnsavedChanges(isDirty, closeWithCleanup)
  }

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
            <label className={labelClass}>Alternative Names</label>
            <input
              type="text"
              {...register("altNames")}
              className={inputClass}
              placeholder="Marcus Aurelius, Antoninus..."
            />
            <p className="mt-1 text-xs text-slate-400">
              Enter alternative names separated by commas
            </p>
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

        <FormActions
          onCancel={handleClose}
          isDirty={isDirty}
          isSaving={isSaving}
        />
      </form>
    </ModalWrapper>
  )
}
