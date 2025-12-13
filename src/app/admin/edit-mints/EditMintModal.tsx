"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateMint, useAddMint } from "~/api/mints"
import { OperationPeriodsEditor } from "~/components/forms/OperationPeriodsEditor"
import type { Mint } from "~/database/schema-mints"
import {
  mintFormInputSchema,
  mintFormSchema,
  type MintFormInputData,
} from "~/lib/validations/mint-form"
import { FormActions } from "../../../components/forms/FormActions"
import { FormErrorDisplay } from "../../../components/forms/FormErrorDisplay"
import { ModalWrapper } from "../../../components/forms/ModalWrapper"
import { arrayToString } from "~/lib/types/form-patterns"

import { handleUnsavedChanges } from "../../../components/forms/formUtils"

type EditMintModalProps = {
  mint: Mint | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: (message: string) => void
  isSaving?: boolean
  mode?: "create" | "edit"
}

// Helper function to transform mint data for form - using standardized utilities
const createFormData = (mint: Mint | null): MintFormInputData => ({
  name: mint?.name ?? "",
  alt_names: arrayToString(mint?.alt_names),
  lat: mint?.lat ?? 0,
  lng: mint?.lng ?? 0,
  mint_marks: arrayToString(mint?.mint_marks),
  officina_marks: arrayToString(mint?.officina_marks),
  flavour_text: mint?.flavour_text ?? "",
  historical_sources: arrayToString(mint?.historical_sources),
  opened_by: mint?.opened_by ?? "",
  coinage_materials: arrayToString(mint?.coinage_materials),
  operation_periods: mint?.operation_periods
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
    reset,
  } = useForm<MintFormInputData>({
    resolver: zodResolver(mintFormInputSchema),
    defaultValues: createFormData(null),
  })

  // Reset form when mint changes
  useEffect(() => {
    if (!isCreateMode && mint) {
      const formData = createFormData(mint)
      reset(formData)
    }
  }, [mint, isCreateMode, reset])

  const updateMintMutation = useUpdateMint()
  const addMintMutation = useAddMint()

  const onSubmit = async (data: MintFormInputData) => {
    if (!isCreateMode && !mint) return

    clearErrors()

    try {
      // Use standardized Zod transformation instead of manual processing
      const mintData = mintFormSchema.parse(data)

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
            {...register("alt_names")}
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
                setValueAs: (v) =>
                  v === "" || v == null ? undefined : Number(v),
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
                setValueAs: (v) =>
                  v === "" || v == null ? undefined : Number(v),
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
            {...register("mint_marks")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="ROMA, R, ROM (comma separated)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate multiple marks with commas
          </p>
        </div>

        {/* Officina Marks */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Officina Marks
          </label>
          <input
            type="text"
            {...register("officina_marks")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="A, B, Γ, Δ, E, S, T (comma separated)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Workshop/officina identifier marks, separate multiple marks with
            commas
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
            {...register("coinage_materials")}
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
            {...register("historical_sources")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="Pliny, Tacitus, Archaeological evidence (comma separated)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate multiple sources with commas
          </p>
        </div>

        {/* Operation Periods */}
        <OperationPeriodsEditor
          value={watch("operation_periods")}
          onChange={(value) => setValue("operation_periods", value)}
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
