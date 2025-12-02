"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { HistoricalSourcesEditor } from "~/components/forms/HistoricalSourcesEditor"
import {
  historicalFigureFormInputSchema,
  historicalFigureFormSchema,
  type HistoricalFigureFormData,
  type HistoricalFigureFormInputData,
} from "~/lib/validations/historical-figure-form"

type HistoricalFigureFormProps = {
  onSubmit: (data: HistoricalFigureFormData) => Promise<void>
  isLoading: boolean
}

export function HistoricalFigureForm({
  onSubmit,
  isLoading,
}: HistoricalFigureFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<HistoricalFigureFormInputData>({
    resolver: zodResolver(historicalFigureFormInputSchema),
  })

  const handleFormSubmit = async (data: HistoricalFigureFormInputData) => {
    try {
      const transformedData = historicalFigureFormSchema.parse(data)
      await onSubmit(transformedData)
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="name">
                  Name*
                </label>
                <input
                  {...register("name")}
                  id="name"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., Augustus, Marcus Aurelius, Trajan"
                />
                {errors.name && (
                  <p className={errorClass}>{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="full_name">
                  Full Name
                </label>
                <input
                  {...register("full_name")}
                  id="full_name"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., Gaius Julius Caesar Octavianus"
                />
                {errors.full_name && (
                  <p className={errorClass}>{errors.full_name.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="authority">
                  Authority/Title*
                </label>
                <input
                  {...register("authority")}
                  id="authority"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., Emperor, Augusta, Caesar, Consul"
                />
                {errors.authority && (
                  <p className={errorClass}>{errors.authority.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="dynasty">
                  Dynasty
                </label>
                <input
                  {...register("dynasty")}
                  id="dynasty"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., Julio-Claudian, Flavian, Severan"
                />
                {errors.dynasty && (
                  <p className={errorClass}>{errors.dynasty.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-200">Dates</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="birth">
                  Birth Year
                </label>
                <input
                  {...register("birth")}
                  id="birth"
                  type="number"
                  className={inputClass}
                  placeholder="e.g., 63 (BCE = negative, CE = positive)"
                />
                {errors.birth && (
                  <p className={errorClass}>{errors.birth.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="death">
                  Death Year
                </label>
                <input
                  {...register("death")}
                  id="death"
                  type="number"
                  className={inputClass}
                  placeholder="e.g., 14"
                />
                {errors.death && (
                  <p className={errorClass}>{errors.death.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="reign_start">
                  Reign Start
                </label>
                <input
                  {...register("reign_start")}
                  id="reign_start"
                  type="number"
                  className={inputClass}
                  placeholder="e.g., 27"
                />
                {errors.reign_start && (
                  <p className={errorClass}>{errors.reign_start.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="reign_end">
                  Reign End
                </label>
                <input
                  {...register("reign_end")}
                  id="reign_end"
                  type="number"
                  className={inputClass}
                  placeholder="e.g., 14"
                />
                {errors.reign_end && (
                  <p className={errorClass}>{errors.reign_end.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="reign_note">
                  Reign Note
                </label>
                <input
                  {...register("reign_note")}
                  id="reign_note"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., Co-emperor with..."
                />
                {errors.reign_note && (
                  <p className={errorClass}>{errors.reign_note.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <div>
              <label className={labelClass} htmlFor="flavour_text">
                Description
              </label>
              <textarea
                {...register("flavour_text")}
                id="flavour_text"
                className={textareaClass}
                placeholder="Rich description of the figure's significance, achievements, and historical context..."
              />
              {errors.flavour_text && (
                <p className={errorClass}>{errors.flavour_text.message}</p>
              )}
            </div>

            <HistoricalSourcesEditor
              value={watch("historical_sources") ?? ""}
              onChange={(value) =>
                setValue("historical_sources", value, { shouldDirty: true })
              }
              error={errors.historical_sources?.message}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="timeline_id">
                  Timeline IDs
                </label>
                <input
                  {...register("timeline_id")}
                  id="timeline_id"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., 1, 2, 3 (comma-separated)"
                />
                {errors.timeline_id && (
                  <p className={errorClass}>{errors.timeline_id.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="artifacts_id">
                  Artifact IDs
                </label>
                <input
                  {...register("artifacts_id")}
                  id="artifacts_id"
                  type="text"
                  className={inputClass}
                  placeholder="e.g., 1, 2, 3 (comma-separated)"
                />
                {errors.artifacts_id && (
                  <p className={errorClass}>{errors.artifacts_id.message}</p>
                )}
              </div>
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
              {isLoading
                ? "Adding Historical Figure..."
                : "Add Historical Figure"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
