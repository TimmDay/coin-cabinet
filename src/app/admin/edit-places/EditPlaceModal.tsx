"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormActions } from "~/components/forms/FormActions"
import { ModalWrapper } from "~/components/forms/ModalWrapper"
import { Select } from "~/components/ui/Select"
import { type Place } from "~/database/schema-places"
import { useUpdatePlace } from "~/api/places"
import {
  placeFormInputSchema,
  placeFormSchema,
  placeKindOptions,
  type PlaceFormInputData,
} from "~/lib/validations/place-form"

type EditPlaceModalProps = {
  place: Place
  isOpen: boolean
  onClose: () => void
}

export function EditPlaceModal({
  place,
  isOpen,
  onClose,
}: EditPlaceModalProps) {
  const mutation = useUpdatePlace()

  const form = useForm<PlaceFormInputData>({
    resolver: zodResolver(placeFormInputSchema),
    values: {
      name: place.name ?? "",
      kind: place.kind ?? "",
      alt_names: (place.alt_names as string[])?.join(", ") ?? "",
      lat: place.lat ?? 0,
      lng: place.lng ?? 0,
      location_description: place.location_description ?? "",
      established_year: place.established_year ?? undefined,
      host_to: place.host_to?.join(", ") ?? "",
      artifact_ids: place.artifact_ids?.join(", ") ?? "",
      historical_sources: place.historical_sources ?? "",
      flavour_text: place.flavour_text ?? "",
    },
  })

  const {
    register,
    formState: { errors, isDirty },
    reset,
  } = form

  const onSubmit = async (data: PlaceFormInputData) => {
    try {
      const transformedData = placeFormSchema.parse(data)
      await mutation.mutateAsync({
        id: place.id,
        updates: transformedData,
      })
      reset()
      onClose()
    } catch (error) {
      console.error("Failed to update place:", error)
    }
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Place: ${place.name}`}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
        {/* Error Display */}
        {mutation.isError && (
          <div className="rounded-md bg-red-900/50 p-4">
            <p className="text-sm text-red-300">
              {mutation.error?.message ?? "Failed to update place"}
            </p>
          </div>
        )}

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Place Name *
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Rome, Temple of Jupiter..."
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Place Kind */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Place Kind *
          </label>
          <Select
            {...register("kind", { required: "Place kind is required" })}
            options={placeKindOptions}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            error={errors.kind?.message}
          />
          {errors.kind && (
            <p className="mt-1 text-sm text-red-600">{errors.kind.message}</p>
          )}
        </div>

        {/* Alternative Names */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Alternative Names
          </label>
          <input
            type="text"
            {...register("alt_names")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Roma, Urbs Aeterna (comma-separated)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Ancient names, transliterations, or alternative spellings
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              placeholder="12.4964"
            />
            {errors.lng && (
              <p className="mt-1 text-sm text-red-600">{errors.lng.message}</p>
            )}
          </div>
        </div>

        {/* Location Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Location Description
          </label>
          <input
            type="text"
            {...register("location_description")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="North face of the hill, grove of trees..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Specific description of the location within the area
          </p>
        </div>

        {/* Established Year */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Established Year
          </label>
          <input
            type="number"
            {...register("established_year", { valueAsNumber: true })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="-753 (for 753 BC)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Year established (negative for BC, positive for AD)
          </p>
        </div>

        {/* Host To */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Host To (Events/Battles/Festivals)
          </label>
          <input
            type="text"
            {...register("host_to")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Battle of Actium, Olympic Games (comma-separated)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Events, battles, or festivals associated with this place
          </p>
        </div>

        {/* Artifact IDs */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Artifact IDs
          </label>
          <input
            type="text"
            {...register("artifact_ids")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="coin_001, statue_042 (comma-separated)"
          />
          <p className="mt-1 text-xs text-gray-500">
            IDs of artifacts associated with this place
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Livy Ab Urbe Condita 1.7, Plutarch Romulus 11 (comma-separated)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Primary sources documenting this place
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Description
          </label>
          <textarea
            {...register("flavour_text")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            rows={4}
            placeholder="Rich description of the place's historical significance..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Rich historical context and significance
          </p>
        </div>

        <FormActions
          onCancel={handleCancel}
          isDirty={isDirty}
          isSaving={mutation.isPending}
          saveLabel="Save Changes"
        />
      </form>
    </ModalWrapper>
  )
}
