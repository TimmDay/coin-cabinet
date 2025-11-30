/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  deityFormInputSchema,
  transformDeityFormInput,
  type DeityFormData,
  type DeityFormInputData,
} from "~/lib/validations/deity-form"

type DeityFormProps = {
  onSubmit: (data: DeityFormData) => Promise<void>
  isLoading: boolean
}

export function DeityForm({ onSubmit, isLoading }: DeityFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DeityFormInputData>({
    resolver: zodResolver(deityFormInputSchema) as any,
  })

  const handleFormSubmit = async (data: DeityFormInputData) => {
    try {
      const transformedData = transformDeityFormInput(data)
      await onSubmit(transformedData)
      // Only clear form if onSubmit completes without throwing
      reset() // Clear form on success
    } catch (error) {
      console.error("Form submission error:", error)
      // Do NOT clear form on failure - preserve user input
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded border border-slate-600 bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-colors"
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="name">
                  Deity Name*
                </label>
                <input
                  {...register("name")}
                  id="name"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., Jupiter, Mars, Victoria"
                />
                {errors.name && (
                  <p className={errorClass}>{errors.name.message}</p>
                )}
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
                  placeholder="e.g., Jove, Optimus Maximus, Tonans (comma-separated)"
                />
                {errors.alt_names && (
                  <p className={errorClass}>{errors.alt_names.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="subtitle">
                Subtitle
              </label>
              <input
                {...register("subtitle")}
                id="subtitle"
                type="text"
                className={inputClass}
                placeholder="e.g., King of the Gods, God of War, Goddess of Victory"
              />
              {errors.subtitle && (
                <p className={errorClass}>{errors.subtitle.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="god_of">
                  Domains & Responsibilities*
                </label>
                <input
                  {...register("god_of")}
                  id="god_of"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., sky, thunder, justice, state (comma-separated)"
                />
                {errors.god_of && (
                  <p className={errorClass}>{errors.god_of.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="similar_gods">
                  Similar Gods from Other Cultures
                </label>
                <input
                  {...register("similar_gods")}
                  id="similar_gods"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., Zeus, Ammon, Taranis (comma-separated)"
                />
                {errors.similar_gods && (
                  <p className={errorClass}>{errors.similar_gods.message}</p>
                )}
              </div>
            </div>
          </div>
          {/* Description Section */}
          <div className="space-y-4">
            <div>
              <label className={labelClass} htmlFor="flavour_text">
                Flavour Text
              </label>
              <textarea
                {...register("flavour_text")}
                id="flavour_text"
                className={textareaClass}
                placeholder="Rich description of the deity's role, significance, and historical context..."
              />
              {errors.flavour_text && (
                <p className={errorClass}>{errors.flavour_text.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="secondary_info">
                Secondary Information
              </label>
              <textarea
                {...register("secondary_info")}
                id="secondary_info"
                className={textareaClass}
                placeholder="Additional descriptive information, iconography, or coin-specific details..."
              />
              {errors.secondary_info && (
                <p className={errorClass}>{errors.secondary_info.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="historical_sources">
                Historical Sources
              </label>
              <textarea
                {...register("historical_sources")}
                id="historical_sources"
                className={inputClass}
                placeholder="e.g., Ovid Metamorphoses 1.163-252, Livy Ab Urbe Condita 1.55 (comma-separated)"
              />
              {errors.historical_sources && (
                <p className={errorClass}>
                  {errors.historical_sources.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass} htmlFor="features_coinage">
                Common features found on coins
              </label>
              <textarea
                {...register("features_coinage")}
                id="features_coinage"
                className={textareaClass}
                placeholder='Simple: eagle, thunderbolt, scepter (comma-separated)
Advanced JSON: [{"name": "eagle", "alt_name": "aquila", "notes": "Sacred bird, often perched on scepter"}]'
              />
              <p className="mt-1 text-sm text-slate-400">
                Enter as comma-separated list or JSON array for detailed
                features
              </p>
              {errors.features_coinage && (
                <p className={errorClass}>{errors.features_coinage.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="legends_coinage">
                Coin Legends & Abbreviations*
              </label>
              <input
                {...register("legends_coinage")}
                id="legends_coinage"
                type="text"
                className={inputClass}
                placeholder="e.g., IOM, IOVI OPTIMO MAXIMO, CONSERVATORI (comma-separated)"
              />
              {errors.legends_coinage && (
                <p className={errorClass}>{errors.legends_coinage.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="temples">
                Associated Temples
              </label>
              <input
                {...register("temples")}
                id="temples"
                type="text"
                className={inputClass}
                placeholder="e.g., temple_001, temple_042 (IDs for future places table)"
              />
              {errors.temples && (
                <p className={errorClass}>{errors.temples.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="festivals">
                Associated Festivals
              </label>
              <input
                {...register("festivals")}
                id="festivals"
                type="text"
                className={inputClass}
                placeholder="e.g., Ides of Mars, Ludi Romani, Saturnalia (comma-separated)"
              />
              {errors.festivals && (
                <p className={errorClass}>{errors.festivals.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="artifact_ids">
                Related Artifact IDs
              </label>
              <input
                {...register("artifact_ids")}
                id="artifact_ids"
                type="text"
                className={inputClass}
                placeholder="Future artifact references (comma-separated)"
              />
              {errors.artifact_ids && (
                <p className={errorClass}>{errors.artifact_ids.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`artemis-button px-8 py-3 transition-colors ${
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-auth-accent-hover"
              }`}
            >
              {isLoading ? "Adding Deity..." : "Add Deity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
