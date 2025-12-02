"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Select } from "~/components/ui/Select"
import {
  placeFormInputSchema,
  placeKindOptions,
  type PlaceFormInputData,
} from "~/lib/validations/place-form"

type PlaceFormProps = {
  onSubmit: (data: PlaceFormInputData) => Promise<void>
  isLoading: boolean
  submitLabel?: string
}

export function PlaceForm({
  onSubmit,
  isLoading,
  submitLabel = "Add Place",
}: PlaceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PlaceFormInputData>({
    resolver: zodResolver(placeFormInputSchema),
  })

  const handleFormSubmit = async (data: PlaceFormInputData) => {
    try {
      await onSubmit(data)
      reset() // Clear form on success
    } catch (error) {
      console.error("Form submission error:", error)
      // Do NOT clear form on failure - preserve user input
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded border border-slate-600 bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none transition-colors"
  const textareaClass = `${inputClass} min-h-[100px] resize-y`
  const labelClass = "block text-sm font-medium text-slate-300 mb-1"
  const errorClass = "text-red-400 text-sm mt-1"

  return (
    <div className="relative">
      {/* Main centered form */}
      <div className="somnus-card mx-auto w-full max-w-4xl p-8">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="name">
                  Place Name*
                </label>
                <input
                  {...register("name")}
                  id="name"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., Rome, Temple of Jupiter, Pompeii"
                />
                {errors.name && (
                  <p className={errorClass}>{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="kind">
                  Place Kind*
                </label>
                <Select
                  {...register("kind", { required: "Place kind is required" })}
                  options={[...placeKindOptions]}
                  className={inputClass}
                  error={errors.kind?.message}
                />
                {errors.kind && (
                  <p className={errorClass}>{errors.kind.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="alt_names">
                Alternative Names
              </label>
              <input
                {...register("alt_names")}
                id="alt_names"
                type="text"
                className={inputClass}
                placeholder="e.g., Roma, Urbs Aeterna (comma-separated)"
              />
              <p className="mt-1 text-sm text-slate-400">
                Ancient names, transliterations, or alternative spellings
              </p>
              {errors.alt_names && (
                <p className={errorClass}>{errors.alt_names.message}</p>
              )}
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Location</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="lat">
                  Latitude*
                </label>
                <input
                  {...register("lat", { valueAsNumber: true })}
                  id="lat"
                  type="number"
                  step="any"
                  className={inputClass}
                  placeholder="e.g., 41.9028"
                />
                <p className="mt-1 text-sm text-slate-400">
                  Decimal degrees (-90 to 90)
                </p>
                {errors.lat && (
                  <p className={errorClass}>{errors.lat.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="lng">
                  Longitude*
                </label>
                <input
                  {...register("lng", { valueAsNumber: true })}
                  id="lng"
                  type="number"
                  step="any"
                  className={inputClass}
                  placeholder="e.g., 12.4964"
                />
                <p className="mt-1 text-sm text-slate-400">
                  Decimal degrees (-180 to 180)
                </p>
                {errors.lng && (
                  <p className={errorClass}>{errors.lng.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="location_description">
                Location Description
              </label>
              <input
                {...register("location_description")}
                id="location_description"
                type="text"
                className={inputClass}
                placeholder="e.g., North face of the hill, grove of trees, bank of the Tiber"
              />
              <p className="mt-1 text-sm text-slate-400">
                Specific description of the location within the area
              </p>
              {errors.location_description && (
                <p className={errorClass}>
                  {errors.location_description.message}
                </p>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Details</h3>

            <div>
              <label className={labelClass} htmlFor="established_year">
                Established Year
              </label>
              <input
                {...register("established_year", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
                id="established_year"
                type="number"
                className={inputClass}
                placeholder="e.g., -753 (for 753 BC)"
              />
              <p className="mt-1 text-sm text-slate-400">
                Year established (negative for BC, positive for AD)
              </p>
              {errors.established_year && (
                <p className={errorClass}>{errors.established_year.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="host_to">
                Host To (Events/Battles/Festivals)
              </label>
              <input
                {...register("host_to")}
                id="host_to"
                type="text"
                className={inputClass}
                placeholder="e.g., Battle of Actium, Olympic Games, Ludi Romani (comma-separated)"
              />
              <p className="mt-1 text-sm text-slate-400">
                Events, battles, or festivals associated with this place
              </p>
              {errors.host_to && (
                <p className={errorClass}>{errors.host_to.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="artifact_ids">
                Artifact IDs
              </label>
              <input
                {...register("artifact_ids")}
                id="artifact_ids"
                type="text"
                className={inputClass}
                placeholder="e.g., coin_001, statue_042 (comma-separated)"
              />
              <p className="mt-1 text-sm text-slate-400">
                IDs of artifacts associated with this place
              </p>
              {errors.artifact_ids && (
                <p className={errorClass}>{errors.artifact_ids.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="historical_sources">
                Historical Sources
              </label>
              <input
                {...register("historical_sources")}
                id="historical_sources"
                type="text"
                className={inputClass}
                placeholder="e.g., Livy Ab Urbe Condita 1.7, Plutarch Romulus 11"
              />
              <p className="mt-1 text-sm text-slate-400">
                Primary sources documenting this place
              </p>
              {errors.historical_sources && (
                <p className={errorClass}>
                  {errors.historical_sources.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="flavour_text">
                Description
              </label>
              <textarea
                {...register("flavour_text")}
                id="flavour_text"
                className={textareaClass}
                placeholder="Rich description of the place's historical significance and characteristics..."
              />
              <p className="mt-1 text-sm text-slate-400">
                Rich historical context and significance
              </p>
              {errors.flavour_text && (
                <p className={errorClass}>{errors.flavour_text.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-purple-900 px-4 py-2 text-white hover:bg-purple-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Saving..." : submitLabel}
          </button>
        </form>
      </div>
    </div>
  )
}
