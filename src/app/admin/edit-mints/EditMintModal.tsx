"use client"

import { useForm } from "react-hook-form"
import { useUpdateMint, useAddMint } from "~/api/mints"
import { OperationPeriodsEditor } from "~/components/forms/OperationPeriodsEditor"
import type { Mint } from "~/database/schema-mints"
import { FormActions } from "../../../components/forms/FormActions"
import { FormErrorDisplay } from "../../../components/forms/FormErrorDisplay"
import { ModalWrapper } from "../../../components/forms/ModalWrapper"

import {
  handleUnsavedChanges,
  parseJSONSafe,
} from "../../../components/forms/formUtils"

type FormData = {
  name: string
  alt_names_raw: string
  lat: number
  lng: number
  mint_marks_raw: string
  flavour_text: string
  historical_sources_raw: string
  opened_by: string
  coinage_materials_raw: string
  operation_periods_raw: string
}

type EditMintModalProps = {
  mint: Mint | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: (message: string) => void
  isSaving?: boolean
  mode?: "create" | "edit"
}

// Helper function to transform mint data for form
const createFormData = (mint: Mint | null): FormData => ({
  name: mint?.name ?? "",
  alt_names_raw: mint?.alt_names?.join(", ") ?? "",
  lat: mint?.lat ?? 0,
  lng: mint?.lng ?? 0,
  mint_marks_raw: mint?.mint_marks?.join(", ") ?? "",
  flavour_text: mint?.flavour_text ?? "",
  historical_sources_raw: mint?.historical_sources?.join(", ") ?? "",
  opened_by: mint?.opened_by ?? "",
  coinage_materials_raw: mint?.coinage_materials?.join(", ") ?? "",
  operation_periods_raw: mint?.operation_periods
    ? JSON.stringify(mint.operation_periods)
    : "",
})

export function EditMintModal({
  mint,
  isOpen,
  onClose,
  onSuccess,
  isSaving = false,
  mode = "edit",
}: EditMintModalProps) {
  const isCreateMode = mode === "create"

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    setError,
    clearErrors,
    setValue,
    watch,
  } = useForm<FormData>({
    values: createFormData(isCreateMode ? null : mint),
  })

  const updateMintMutation = useUpdateMint()
  const addMintMutation = useAddMint()

  // Helper function for processing arrays
  const processArray = (str: string) =>
    str.trim()
      ? str
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []

  const onSubmit = async (data: FormData) => {
    if (!isCreateMode && !mint) return

    clearErrors()

    const mintData = {
      name: data.name.trim(),
      alt_names: processArray(data.alt_names_raw),
      lat: data.lat,
      lng: data.lng,
      mint_marks: processArray(data.mint_marks_raw),
      flavour_text: data.flavour_text.trim() || undefined,
      historical_sources: processArray(data.historical_sources_raw),
      opened_by: data.opened_by.trim() || undefined,
      coinage_materials: processArray(data.coinage_materials_raw),
      operation_periods: parseJSONSafe<Array<[number, number, string]>>(
        data.operation_periods_raw,
      ),
    }

    // Validate required fields
    if (!mintData.name) {
      setError("name", { message: "Name is required" })
      return
    }

    if (mintData.lat < -90 || mintData.lat > 90) {
      setError("lat", { message: "Latitude must be between -90 and 90" })
      return
    }

    if (mintData.lng < -180 || mintData.lng > 180) {
      setError("lng", { message: "Longitude must be between -180 and 180" })
      return
    }

    try {
      if (isCreateMode) {
        await addMintMutation.mutateAsync(mintData)
        onSuccess?.("✅ Mint created successfully")
      } else {
        await updateMintMutation.mutateAsync({
          id: mint!.id,
          updates: mintData,
        })
        onSuccess?.("✅ Mint updated successfully")
      }
      onClose()
    } catch (error) {
      console.error("Failed to save mint:", error)
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save changes. Please try again.",
      })
    }
  }

  const handleClose = () => handleUnsavedChanges(isDirty, onClose)

  if (!isOpen || (!isCreateMode && !mint)) return null

  const modalTitle = isCreateMode
    ? "Add New Mint"
    : `Edit Mint: ${mint?.name ?? "Unknown"}`

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose} title={modalTitle}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
        <FormErrorDisplay errors={errors} />

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Mint Name *
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="Rome, Alexandria, Antioch..."
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Alt Names */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Alternative Names
          </label>
          <input
            type="text"
            {...register("alt_names_raw")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="Roma, Ῥώμη (comma separated)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate multiple names with commas
          </p>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Latitude *
            </label>
            <input
              type="number"
              step="any"
              {...register("lat", {
                valueAsNumber: true,
                required: "Latitude is required",
                min: { value: -90, message: "Latitude must be >= -90" },
                max: { value: 90, message: "Latitude must be <= 90" },
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="41.9028"
            />
            {errors.lat && (
              <p className="mt-1 text-sm text-red-600">{errors.lat.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Longitude *
            </label>
            <input
              type="number"
              step="any"
              {...register("lng", {
                valueAsNumber: true,
                required: "Longitude is required",
                min: { value: -180, message: "Longitude must be >= -180" },
                max: { value: 180, message: "Longitude must be <= 180" },
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="12.4964"
            />
            {errors.lng && (
              <p className="mt-1 text-sm text-red-600">{errors.lng.message}</p>
            )}
          </div>
        </div>

        {/* Mint Marks */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Mint Marks
          </label>
          <input
            type="text"
            {...register("mint_marks_raw")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="ROMA, R, ROM (comma separated)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate multiple marks with commas
          </p>
        </div>

        {/* Opened By */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Opened By
          </label>
          <input
            type="text"
            {...register("opened_by")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="Augustus, Roman Republic, etc."
          />
        </div>

        {/* Coinage Materials */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Coinage Materials
          </label>
          <input
            type="text"
            {...register("coinage_materials_raw")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="bronze, silver, gold (comma separated)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate multiple materials with commas
          </p>
        </div>

        {/* Historical Sources */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Historical Sources
          </label>
          <input
            type="text"
            {...register("historical_sources_raw")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="Pliny, Tacitus, Archaeological evidence (comma separated)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate multiple sources with commas
          </p>
        </div>

        {/* Operation Periods */}
        <OperationPeriodsEditor
          value={watch("operation_periods_raw")}
          onChange={(value) => setValue("operation_periods_raw", value)}
        />

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Description
          </label>
          <textarea
            {...register("flavour_text")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            rows={4}
            placeholder="Historical context, significance, and interesting details..."
          />
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
