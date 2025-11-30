"use client"

import { useForm } from "react-hook-form"
import { FormActions, FormErrorDisplay, ModalWrapper, processArray } from "~/components/admin/shared"
import type { Deity } from "~/database/schema-deities"

type FormData = {
  name: string
  subtitle: string
  flavour_text: string
  secondary_info: string
  alt_names_raw: string
  similar_gods_raw: string
  god_of_raw: string
  legends_coinage_raw: string
  historical_sources_raw: string
  temples_raw: string
  festivals_raw: string
}

type EditDeityModalProps = {
  isOpen: boolean
  onClose: () => void
  deity: Deity | null
  onSave: (id: number, updates: Partial<Deity>) => Promise<void>
  isSaving?: boolean
}

// Helper function to transform deity data for form
const createDeityFormData = (deity: Deity | null): FormData => ({
  name: deity?.name ?? "",
  subtitle: deity?.subtitle ?? "",
  flavour_text: deity?.flavour_text ?? "",
  secondary_info: deity?.secondary_info ?? "",
  alt_names_raw: deity?.alt_names?.join(", ") ?? "",
  similar_gods_raw: deity?.similar_gods?.join(", ") ?? "",
  god_of_raw: deity?.god_of?.join(", ") ?? "",
  legends_coinage_raw: deity?.legends_coinage?.join(", ") ?? "",
  historical_sources_raw: deity?.historical_sources?.join(", ") ?? "",
  temples_raw: deity?.temples?.join(", ") ?? "",
  festivals_raw: deity?.festivals?.join(", ") ?? "",
})

export function EditDeityModal({
  isOpen,
  onClose,
  deity,
  onSave,
  isSaving = false,
}: EditDeityModalProps) {
  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    setError,
    clearErrors,
  } = useForm<FormData>({
    values: createDeityFormData(deity),
  })

  const onSubmit = async (data: FormData) => {
    if (!deity) return

    clearErrors()

    const updates = {
      name: data.name.trim(),
      subtitle: data.subtitle.trim() || undefined,
      flavour_text: data.flavour_text.trim() || null,
      secondary_info: data.secondary_info.trim() || null,
      alt_names: processArray(data.alt_names_raw),
      similar_gods: processArray(data.similar_gods_raw),
      god_of: processArray(data.god_of_raw),
      legends_coinage: processArray(data.legends_coinage_raw),
      historical_sources: processArray(data.historical_sources_raw),
      temples: processArray(data.temples_raw),
      festivals: processArray(data.festivals_raw),
    }

    if (!updates.name) {
      setError("name", { message: "Name is required" })
      return
    }

    if (updates.god_of.length === 0) {
      setError("god_of_raw", { message: "At least one domain is required" })
      return
    }

    try {
      await onSave(deity.id, updates)
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
      if (confirm("You have unsaved changes. Are you sure you want to close?")) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  if (!deity) return null

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title={`Edit Deity: ${deity.name}`}
    >
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            rows={3}
            placeholder="Additional descriptive information, iconography, or coin-specific details..."
          />
        </div>

        {/* Temples */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Associated Temples
          </label>
          <input
            type="text"
            {...register("temples_raw")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="temple_001, temple_042 (IDs for future places table)..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate multiple temple IDs with commas
          </p>
        </div>

        {/* Festivals */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Associated Festivals
          </label>
          <input
            type="text"
            {...register("festivals_raw")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Ides of Mars, Ludi Romani, Saturnalia..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate multiple festivals with commas
          </p>
        </div>

        <FormActions
          onCancel={handleClose}
          isDirty={isDirty}
          isSaving={isSaving}
          saveLabel="Save Changes"
        />
      </form>
    </ModalWrapper>
  )
}
