"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import type { Mint } from "~/database/schema-mints"
import {
  mintFormInputSchema,
  type MintFormInputData,
} from "~/lib/validations/mint-form"

type MintFormProps = {
  mint?: Mint
  onSubmit: (data: MintFormInputData) => void
  isLoading?: boolean
  submitLabel?: string
  showSubmitButton?: boolean
}

// Helper function to convert arrays back to comma-separated strings
function arraysToStrings(mint: Mint): Omit<MintFormInputData, "lat" | "lng"> & {
  lat: number
  lng: number
} {
  return {
    name: mint.name,
    alt_names: mint.alt_names?.join(", ") ?? "",
    lat: mint.lat,
    lng: mint.lng,
    mint_marks: mint.mint_marks?.join(", ") ?? "",
    flavour_text: mint.flavour_text ?? "",
    historical_sources: mint.historical_sources?.join(", ") ?? "",
    opened_by: mint.opened_by ?? "",
    coinage_materials: mint.coinage_materials?.join(", ") ?? "",
    operation_periods: mint.operation_periods
      ? JSON.stringify(mint.operation_periods)
      : "",
  }
}

export function MintForm({
  mint,
  onSubmit,
  isLoading = false,
  submitLabel = "Save Mint",
  showSubmitButton = true,
}: MintFormProps) {
  const [mounted, setMounted] = useState(false)

  const form = useForm<MintFormInputData>({
    resolver: zodResolver(mintFormInputSchema),
    defaultValues: {
      name: mint?.name ?? "",
      alt_names: mint?.alt_names?.join(", ") ?? "",
      lat: mint?.lat ?? 0,
      lng: mint?.lng ?? 0,
      mint_marks: mint?.mint_marks?.join(", ") ?? "",
      flavour_text: mint?.flavour_text ?? "",
      historical_sources: mint?.historical_sources?.join(", ") ?? "",
      opened_by: mint?.opened_by ?? "",
      coinage_materials: mint?.coinage_materials?.join(", ") ?? "",
      operation_periods: mint?.operation_periods
        ? JSON.stringify(mint.operation_periods)
        : "",
    },
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mint && mounted) {
      const formData = arraysToStrings(mint)
      form.reset(formData)
    }
  }, [mint, form, mounted])

  if (!mounted) {
    return null
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Mint Name *
          </label>
          <input
            type="text"
            placeholder="e.g., Rome, Alexandria, Antioch"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            {...form.register("name")}
          />
          <p className="mt-1 text-sm text-gray-500">
            Primary name of the mint location
          </p>
          {form.formState.errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Alternative Names
          </label>
          <input
            type="text"
            placeholder="Roma, Ῥώμη (comma separated)"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            {...form.register("alt_names")}
          />
          <p className="mt-1 text-sm text-gray-500">
            Ancient names, transliterations, or alternative spellings
          </p>
          {form.formState.errors.alt_names && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.alt_names.message}
            </p>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Location</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Latitude *
            </label>
            <input
              type="number"
              step="any"
              placeholder="41.9028"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              {...form.register("lat", { valueAsNumber: true })}
            />
            <p className="mt-1 text-sm text-gray-500">
              Decimal degrees (-90 to 90)
            </p>
            {form.formState.errors.lat && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.lat.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Longitude *
            </label>
            <input
              type="number"
              step="any"
              placeholder="12.4964"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              {...form.register("lng", { valueAsNumber: true })}
            />
            <p className="mt-1 text-sm text-gray-500">
              Decimal degrees (-180 to 180)
            </p>
            {form.formState.errors.lng && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.lng.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mint Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mint Details</h3>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Mint Marks
          </label>
          <input
            type="text"
            placeholder="ROMA, R, ROM (comma separated)"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            {...form.register("mint_marks")}
          />
          <p className="mt-1 text-sm text-gray-500">
            Common abbreviations and symbols used on coins
          </p>
          {form.formState.errors.mint_marks && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.mint_marks.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Opened By
          </label>
          <input
            type="text"
            placeholder="Augustus, Roman Republic, etc."
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            {...form.register("opened_by")}
          />
          <p className="mt-1 text-sm text-gray-500">
            Emperor or authority who established the mint
          </p>
          {form.formState.errors.opened_by && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.opened_by.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Coinage Materials
          </label>
          <input
            type="text"
            placeholder="bronze, silver, gold (comma separated)"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            {...form.register("coinage_materials")}
          />
          <p className="mt-1 text-sm text-gray-500">
            Metals and materials used for coin production
          </p>
          {form.formState.errors.coinage_materials && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.coinage_materials.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Historical Sources
          </label>
          <input
            type="text"
            placeholder="Pliny, Tacitus, Archaeological evidence (comma separated)"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            {...form.register("historical_sources")}
          />
          <p className="mt-1 text-sm text-gray-500">
            Primary sources documenting this mint
          </p>
          {form.formState.errors.historical_sources && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.historical_sources.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Operation Periods
          </label>
          <input
            type="text"
            placeholder="[[-260, 476, 'Republic'], [294, 423, 'Diocletian']]"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500 focus:outline-none"
            {...form.register("operation_periods")}
          />
          <p className="mt-1 text-sm text-gray-500">
            JSON array of operation periods: [[startYear, endYear,
            &quot;ruler/period&quot;], ...]
          </p>
          {form.formState.errors.operation_periods && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.operation_periods.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            placeholder="Historical context, significance, and interesting details about this mint..."
            className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500 focus:outline-none"
            {...form.register("flavour_text")}
          />
          <p className="mt-1 text-sm text-gray-500">
            Rich historical context and significance
          </p>
          {form.formState.errors.flavour_text && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.flavour_text.message}
            </p>
          )}
        </div>
      </div>

      {showSubmitButton && (
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      )}
    </form>
  )
}
