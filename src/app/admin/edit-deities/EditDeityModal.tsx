"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { FormActions, FormErrorDisplay, ModalWrapper } from "~/components/forms"
import { CoinageFeaturesEditor } from "~/components/forms/CoinageFeaturesEditor"
import { FestivalsEditor } from "~/components/forms/FestivalsEditor"
import { SimpleMultiSelect } from "~/components/ui/SimpleMultiSelect"
import type { Deity, Festival } from "~/database/schema-deities"
import { useFormPersistence } from "~/hooks/useFormPersistence"
import { usePlaceOptions } from "~/hooks/usePlaceOptions"
import type { DeityFormInput } from "~/lib/validations/deity-form"

type FormData = {
  name: string
  subtitle: string
  flavour_text: string
  secondary_info: string
  alt_names_raw: string
  similar_gods_raw: string
  god_of_raw: string
  features_coinage_raw: string
  legends_coinage_raw: string
  historical_sources_raw: string
  place_ids: string[]
  festivals_raw: string
}

type EditDeityModalProps = {
  isOpen: boolean
  onClose: () => void
  deity: Deity | null
  onSave: (id: number, updates: DeityFormInput) => Promise<void>
  isSaving?: boolean
}

// Helper function to transform deity data for form
const createDeityFormData = (deity: Deity | null): FormData => {
  const formData = {
    name: deity?.name ?? "",
    subtitle: deity?.subtitle ?? "",
    flavour_text: deity?.flavour_text ?? "",
    secondary_info: deity?.secondary_info ?? "",
    alt_names_raw: deity?.alt_names?.join(", ") ?? "",
    similar_gods_raw: deity?.similar_gods?.join(", ") ?? "",
    god_of_raw: deity?.god_of?.join(", ") ?? "",
    features_coinage_raw: (() => {
      if (!deity?.features_coinage) return ""
      if (
        Array.isArray(deity.features_coinage) &&
        deity.features_coinage.length === 0
      ) {
        return ""
      }
      return JSON.stringify(deity.features_coinage)
    })(),
    legends_coinage_raw: deity?.legends_coinage?.join(", ") ?? "",
    historical_sources_raw: deity?.historical_sources?.join(", ") ?? "",
    place_ids:
      deity?.place_ids && Array.isArray(deity.place_ids)
        ? deity.place_ids.map((id) => id.toString())
        : [],
    festivals_raw: (() => {
      if (!deity?.festivals) return ""

      // If it's an empty array, return empty string
      if (Array.isArray(deity.festivals) && deity.festivals.length === 0) {
        return ""
      }

      // If it's already a string (from database), use as-is
      if (typeof deity.festivals === "string") {
        return deity.festivals
      }

      // Handle array of strings (double-encoded JSON)
      if (
        Array.isArray(deity.festivals) &&
        deity.festivals.every((item) => typeof item === "string")
      ) {
        try {
          const parsed = deity.festivals.map(
            (jsonString) => JSON.parse(jsonString) as Festival,
          )
          return JSON.stringify(parsed)
        } catch {
          return JSON.stringify(deity.festivals)
        }
      }

      // If it's an object/array, stringify it
      return JSON.stringify(deity.festivals)
    })(),
  }

  return formData
}

export function EditDeityModal({
  isOpen,
  onClose,
  deity,
  onSave,
  isSaving = false,
}: EditDeityModalProps) {
  const { options: placeOptions } = usePlaceOptions()
  const form = useForm<FormData>({
    defaultValues: createDeityFormData(null),
  })

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    setError,
    clearErrors,
    setValue,
    watch,
    reset,
  } = form

  const isCreateMode = !deity

  // Form persistence for mobile browser resilience
  const { clearSavedData } = useFormPersistence({
    key: isCreateMode ? "create-deity" : `edit-deity-${deity?.id}`,
    form,
    enabled: isOpen,
  })

  // Reset form when deity changes (but only for edit mode to avoid overriding persistence)
  useEffect(() => {
    if (deity && !isCreateMode) {
      const formData = createDeityFormData(deity)
      reset(formData)
    }
    // Don't reset for create mode - let persistence handle it
  }, [deity, isCreateMode, reset])

  // Initialize create mode with defaults only if no saved data exists
  useEffect(() => {
    if (isCreateMode && isOpen && typeof window !== "undefined") {
      const savedData = localStorage.getItem("form_create-deity")
      if (!savedData) {
        // Only set defaults if there's no saved data
        reset(createDeityFormData(null))
      }
    }
  }, [isCreateMode, isOpen, reset])

  const onSubmit = async (data: FormData) => {
    clearErrors()

    const isCreateMode = !deity

    // Send raw input data to match deityFormSchema expectations
    const updates = {
      name: data.name.trim(),
      subtitle: data.subtitle.trim() || "",
      flavour_text: data.flavour_text.trim() || "",
      secondary_info: data.secondary_info.trim() || "",
      alt_names: data.alt_names_raw.trim() || "",
      similar_gods: data.similar_gods_raw.trim() || "",
      god_of: data.god_of_raw.trim(),
      features_coinage: data.features_coinage_raw?.trim() || "",
      legends_coinage: data.legends_coinage_raw?.trim() || "",
      historical_sources: data.historical_sources_raw.trim() || "",
      place_ids: data.place_ids || [],
      festivals: data.festivals_raw?.trim() || "",
      artifact_ids: "", // Default empty string for artifact_ids
    }

    if (!updates.name) {
      setError("name", { message: "Name is required" })
      return
    }

    if (!updates.god_of || updates.god_of.length === 0) {
      setError("god_of_raw", { message: "At least one domain is required" })
      return
    }

    try {
      if (isCreateMode) {
        await onSave(0, updates) // Use 0 as dummy id for create
      } else {
        await onSave(deity.id, updates)
      }
      // Clear saved form data on successful save
      clearSavedData()
      onClose()
    } catch (error) {
      console.error("Failed to save deity:", error)
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save changes. Please try again.",
      })
    }
  }

  const handleClose = () => {
    if (isDirty) {
      if (
        confirm("You have unsaved changes. Are you sure you want to close?")
      ) {
        // Clear saved form data when user confirms close
        if (isCreateMode) {
          clearSavedData()
        }
        onClose()
      }
    } else {
      // Clear saved form data when closing without changes
      if (isCreateMode) {
        clearSavedData()
      }
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title={deity ? `Edit Deity: ${deity.name}` : "Add New Deity"}
    >
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormErrorDisplay errors={errors} />

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Name *
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="Jupiter, Mars, Victoria..."
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Subtitle */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Subtitle
            </label>
            <input
              type="text"
              {...register("subtitle")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="King of the Gods, God of War..."
            />
          </div>

          {/* God Of */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              God Of (Domains) *
            </label>
            <input
              type="text"
              {...register("god_of_raw", {
                required: "At least one domain is required",
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="sky, thunder, justice, state..."
            />
            {errors.god_of_raw && (
              <p className="mt-1 text-sm text-red-600">
                {errors.god_of_raw.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple domains with commas
            </p>
          </div>

          {/* Alternative Names */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Alternative Names
            </label>
            <input
              type="text"
              {...register("alt_names_raw")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="Jove, Optimus Maximus..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple names with commas
            </p>
          </div>

          {/* Similar Gods */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Similar Gods (Other Cultures)
            </label>
            <input
              type="text"
              {...register("similar_gods_raw")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="Zeus, Ammon..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple gods with commas
            </p>
          </div>

          {/* Legends on Coinage */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Legends on Coinage
            </label>
            <input
              type="text"
              {...register("legends_coinage_raw")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="IOM, IOVI OPTIMO MAXIMO, CONSERVATORI..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple legends with commas
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
              placeholder="Ovid Metamorphoses 1.163, Pliny Natural History 2.7..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple sources with commas
            </p>
          </div>

          {/* Flavour Text */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              {...register("flavour_text")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              rows={4}
              placeholder="Rich description of the deity's role and significance..."
            />
          </div>

          {/* Secondary Information */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Secondary Information
            </label>
            <textarea
              {...register("secondary_info")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              rows={3}
              placeholder="Additional descriptive information, iconography, or coin-specific details..."
            />
          </div>

          {/* Place IDs */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Associated Places
            </label>
            <SimpleMultiSelect
              options={placeOptions}
              selectedValues={watch("place_ids") || []}
              onSelectionChange={(values) => setValue("place_ids", values)}
              placeholder="Select temples, shrines, sacred sites..."
            />
          </div>

          {/* Coinage Features */}
          <CoinageFeaturesEditor
            value={watch("features_coinage_raw") ?? ""}
            onChange={(value) =>
              setValue("features_coinage_raw", value, { shouldDirty: true })
            }
            error={errors.features_coinage_raw?.message}
          />

          {/* Festivals */}
          <FestivalsEditor
            value={watch("festivals_raw") ?? ""}
            onChange={(value) =>
              setValue("festivals_raw", value, { shouldDirty: true })
            }
            error={errors.festivals_raw?.message}
          />

          <FormActions
            onCancel={handleClose}
            isDirty={isDirty}
            isSaving={isSaving}
            saveLabel="Save Changes"
          />
        </form>
      </div>
    </ModalWrapper>
  )
}
