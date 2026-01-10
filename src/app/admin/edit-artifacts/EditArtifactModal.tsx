"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { FormActions, FormErrorDisplay, ModalWrapper } from "~/components/forms"
import type { Artifact } from "~/database/schema-artifacts"
import { useFormPersistence } from "~/hooks/useFormPersistence"
import type { ArtifactFormData } from "~/lib/validations/artifact-form"

type FormData = {
  name: string
  img_src: string
  institution_name: string
  location_name: string
  lat: string
  lng: string
  medium: string
  artist_designer: string
  year_of_creation_estimate: string
  flavour_text: string
  historical_notes: string
  historical_sources_raw: string
}

type EditArtifactModalProps = {
  isOpen: boolean
  onClose: () => void
  artifact: Artifact | null
  onSave: (id: string | null, updates: ArtifactFormData) => Promise<void>
  isSaving?: boolean
}

// Helper function to transform artifact data for form
const createArtifactFormData = (artifact: Artifact | null): FormData => ({
  name: artifact?.name ?? "",
  img_src: artifact?.img_src ?? "",
  institution_name: artifact?.institution_name ?? "",
  location_name: artifact?.location_name ?? "",
  lat: artifact?.lat?.toString() ?? "",
  lng: artifact?.lng?.toString() ?? "",
  medium: artifact?.medium ?? "",
  artist_designer: artifact?.artist_designer ?? "",
  year_of_creation_estimate:
    artifact?.year_of_creation_estimate?.toString() ?? "",
  flavour_text: artifact?.flavour_text ?? "",
  historical_notes: artifact?.historical_notes ?? "",
  historical_sources_raw: artifact?.historical_sources?.join(", ") ?? "",
})

export function EditArtifactModal({
  isOpen,
  onClose,
  artifact,
  onSave,
  isSaving = false,
}: EditArtifactModalProps) {
  const isCreate = !artifact
  const formKey = artifact
    ? `artifact-edit-${artifact.id}`
    : "artifact-create-new"

  const form = useForm<FormData>({
    defaultValues: createArtifactFormData(artifact),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form

  // Use form persistence - enabled for both create and edit
  const { clearSavedData } = useFormPersistence({
    key: formKey,
    form,
    enabled: true,
  })

  // Reset form when artifact changes, but only if no saved data exists
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(`form_${formKey}`)
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData) as { timestamp?: number }
          // Only skip reset if saved data is recent (within 24 hours)
          if (
            parsed.timestamp &&
            Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000
          ) {
            return // Don't reset - let form persistence restore the data
          }
        } catch {
          // If parsing fails, proceed with normal reset
        }
      }
    }
    reset(createArtifactFormData(artifact))
  }, [artifact, reset, formKey])

  const handleClose = () => {
    clearSavedData()
    reset()
    onClose()
  }

  const onSubmit = async (data: FormData) => {
    // Transform form data to match expected schema
    const updates: ArtifactFormData = {
      name: data.name,
      img_src: data.img_src || null,
      institution_name: data.institution_name || null,
      location_name: data.location_name || null,
      lat: data.lat ? parseFloat(data.lat) : null,
      lng: data.lng ? parseFloat(data.lng) : null,
      medium: data.medium || null,
      artist_designer: data.artist_designer || null,
      year_of_creation_estimate: data.year_of_creation_estimate
        ? parseInt(data.year_of_creation_estimate)
        : null,
      flavour_text: data.flavour_text || null,
      historical_notes: data.historical_notes || null,
      historical_sources: data.historical_sources_raw
        ? data.historical_sources_raw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : null,
    }

    await onSave(artifact?.id ?? null, updates)
    clearSavedData()
    handleClose()
  }

  if (!isOpen) return null

  const title = isCreate ? "Create New Artifact" : "Edit Artifact"

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose} title={title}>
      <div className="space-y-6 p-6">
        <FormErrorDisplay errors={errors} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name (required) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Name *
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="Artifact name..."
              required
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Image Source */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Image URL
            </label>
            <input
              type="url"
              {...register("img_src")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Institution Information */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Institution Name
              </label>
              <input
                type="text"
                {...register("institution_name")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="Museum or institution name..."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Location Name
              </label>
              <input
                type="text"
                {...register("location_name")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                {...register("lat")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="41.8919"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                {...register("lng")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="12.5113"
              />
            </div>
          </div>

          {/* Medium */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Medium
            </label>
            <input
              type="text"
              {...register("medium")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="Bronze, Marble, Gold, etc."
            />
          </div>

          {/* Artist/Designer */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Artist/Designer
            </label>
            <input
              type="text"
              {...register("artist_designer")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="Artist or designer name (if known)"
            />
          </div>

          {/* Year of Creation */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Year of Creation (Estimate)
            </label>
            <input
              type="number"
              {...register("year_of_creation_estimate")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="100"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter year as a number (e.g., 50 for 50 AD, -50 for 50 BC)
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
              placeholder="Detailed description of the artifact..."
            />
          </div>

          {/* Historical Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Historical Notes
            </label>
            <textarea
              {...register("historical_notes")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              rows={3}
              placeholder="Historical context and significance..."
            />
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

          <FormActions
            onCancel={handleClose}
            isDirty={isDirty}
            isSaving={isSaving}
            saveLabel={isCreate ? "Create Artifact" : "Save Changes"}
          />
        </form>
      </div>
    </ModalWrapper>
  )
}
