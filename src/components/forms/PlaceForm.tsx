"use client"

import { useState } from "react"
import { Select } from "~/components/ui/Select"
import {
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
  const [formData, setFormData] = useState<PlaceFormInputData>({
    name: "",
    alt_names: "",
    kind: "city",
    lat: 0,
    lng: 0,
    location_description: "",
    established_year: undefined,
    host_to: "",
    artifact_ids: "",
    historical_sources: "",
    flavour_text: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" && value !== "" ? parseFloat(value) : value || "",
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      kind: value as PlaceFormInputData["kind"],
    }))
    if (errors.kind) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.kind
        return newErrors
      })
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = "Place name is required"
    }
    if (!formData.kind) {
      newErrors.kind = "Place kind is required"
    }
    if (formData.lat === undefined || formData.lat === null) {
      newErrors.lat = "Latitude is required"
    }
    if (formData.lng === undefined || formData.lng === null) {
      newErrors.lng = "Longitude is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await onSubmit(formData)
      await onSubmit(formData)
      // Clear form on success
      setFormData({
        name: "",
        alt_names: "",
        kind: "city",
        lat: 0,
        lng: 0,
        location_description: "",
        established_year: undefined,
        host_to: "",
        artifact_ids: "",
        historical_sources: "",
        flavour_text: "",
      })
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
        <form onSubmit={handleFormSubmit} className="space-y-8">
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
                  id="name"
                  name="name"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., Rome, Temple of Jupiter, Pompeii"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className={errorClass}>{errors.name}</p>}
              </div>

              <div>
                <label className={labelClass} htmlFor="kind">
                  Place Kind*
                </label>
                <Select
                  options={placeKindOptions}
                  className={inputClass}
                  value={formData.kind}
                  onChange={handleSelectChange}
                />
                {errors.kind && <p className={errorClass}>{errors.kind}</p>}
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="alt_names">
                Alternative Names
              </label>
              <input
                id="alt_names"
                name="alt_names"
                type="text"
                className={inputClass}
                placeholder="e.g., Roma, Urbs Aeterna (comma-separated)"
                value={formData.alt_names}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-slate-400">
                Ancient names, transliterations, or alternative spellings
              </p>
              {errors.alt_names && (
                <p className={errorClass}>{errors.alt_names}</p>
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
                  id="lat"
                  name="lat"
                  type="number"
                  step="any"
                  className={inputClass}
                  placeholder="e.g., 41.9028"
                  value={formData.lat}
                  onChange={handleChange}
                />
                <p className="mt-1 text-sm text-slate-400">
                  Decimal degrees (-90 to 90)
                </p>
                {errors.lat && <p className={errorClass}>{errors.lat}</p>}
              </div>

              <div>
                <label className={labelClass} htmlFor="lng">
                  Longitude*
                </label>
                <input
                  id="lng"
                  name="lng"
                  type="number"
                  step="any"
                  className={inputClass}
                  placeholder="e.g., 12.4964"
                  value={formData.lng}
                  onChange={handleChange}
                />
                <p className="mt-1 text-sm text-slate-400">
                  Decimal degrees (-180 to 180)
                </p>
                {errors.lng && <p className={errorClass}>{errors.lng}</p>}
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="location_description">
                Location Description
              </label>
              <input
                id="location_description"
                name="location_description"
                type="text"
                className={inputClass}
                placeholder="e.g., North face of the hill, grove of trees, bank of the Tiber"
                value={formData.location_description}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-slate-400">
                Specific description of the location within the area
              </p>
              {errors.location_description && (
                <p className={errorClass}>{errors.location_description}</p>
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
                id="established_year"
                name="established_year"
                type="number"
                className={inputClass}
                placeholder="e.g., -753 (for 753 BC)"
                value={formData.established_year ?? ""}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-slate-400">
                Year established (negative for BC, positive for AD)
              </p>
              {errors.established_year && (
                <p className={errorClass}>{errors.established_year}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="host_to">
                Host To (Events/Battles/Festivals)
              </label>
              <input
                id="host_to"
                name="host_to"
                type="text"
                className={inputClass}
                placeholder="e.g., Battle of Actium, Olympic Games, Ludi Romani (comma-separated)"
                value={formData.host_to}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-slate-400">
                Events, battles, or festivals associated with this place
              </p>
              {errors.host_to && <p className={errorClass}>{errors.host_to}</p>}
            </div>

            <div>
              <label className={labelClass} htmlFor="artifact_ids">
                Artifact IDs
              </label>
              <input
                id="artifact_ids"
                name="artifact_ids"
                type="text"
                className={inputClass}
                placeholder="e.g., coin_001, statue_042 (comma-separated)"
                value={formData.artifact_ids}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-slate-400">
                IDs of artifacts associated with this place
              </p>
              {errors.artifact_ids && (
                <p className={errorClass}>{errors.artifact_ids}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="historical_sources">
                Historical Sources
              </label>
              <input
                id="historical_sources"
                name="historical_sources"
                type="text"
                className={inputClass}
                placeholder="e.g., Livy Ab Urbe Condita 1.7, Plutarch Romulus 11"
                value={formData.historical_sources}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-slate-400">
                Primary sources documenting this place
              </p>
              {errors.historical_sources && (
                <p className={errorClass}>{errors.historical_sources}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="flavour_text">
                Description
              </label>
              <textarea
                id="flavour_text"
                name="flavour_text"
                className={textareaClass}
                placeholder="Rich description of the place's historical significance and characteristics..."
                value={formData.flavour_text}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-slate-400">
                Rich historical context and significance
              </p>
              {errors.flavour_text && (
                <p className={errorClass}>{errors.flavour_text}</p>
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
