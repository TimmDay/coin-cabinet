"use client"

import { useForm } from "react-hook-form"
import { SimpleMultiSelect } from "~/components/ui/SimpleMultiSelect"
import type { SomnusCollection } from "~/database/schema-somnus-collection"
import { useDeityOptions } from "~/hooks/useDeityOptions"
import {
  FormErrorDisplay,
  handleUnsavedChanges,
  ModalWrapper,
} from "../../../components/forms"

type FormData = {
  nickname: string
  legend_o: string
  legend_o_expanded: string
  legend_o_translation: string
  desc_o: string
  legend_r: string
  legend_r_expanded: string
  legend_r_translation: string
  desc_r: string
  flavour_text: string
  deity_id: string[]
  devicesRaw: string
  setsRaw: string
}

type EditCoinModalProps = {
  isOpen: boolean
  onClose: () => void
  coin: SomnusCollection | null
  onSave: (id: number, updates: Partial<SomnusCollection>) => Promise<void>
  isSaving?: boolean
}

// Helper function to transform coin data for form
const createCoinFormData = (coin: SomnusCollection | null): FormData => ({
  nickname: coin?.nickname ?? "",
  legend_o: coin?.legend_o ?? "",
  legend_o_expanded: coin?.legend_o_expanded ?? "",
  legend_o_translation: coin?.legend_o_translation ?? "",
  desc_o: coin?.desc_o ?? "",
  legend_r: coin?.legend_r ?? "",
  legend_r_expanded: coin?.legend_r_expanded ?? "",
  legend_r_translation: coin?.legend_r_translation ?? "",
  desc_r: coin?.desc_r ?? "",
  flavour_text: coin?.flavour_text ?? "",
  deity_id: coin?.deity_id ?? [],
  devicesRaw: coin?.devices?.join(", ") ?? "",
  setsRaw: coin?.sets?.join(", ") ?? "",
})

export function EditCoinModal({
  isOpen,
  onClose,
  coin,
  onSave,
  isSaving = false,
}: EditCoinModalProps) {
  const { options: deityOptions } = useDeityOptions()

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    setError,
    clearErrors,
    setValue,
    watch,
  } = useForm<FormData>({
    values: createCoinFormData(coin),
  })

  // Inline helper
  const processArray = (str: string, lower = false) => {
    const arr = str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (lower ? s.toLowerCase() : s))
    return arr.length > 0 ? arr : null
  }

  const onSubmit = async (data: FormData) => {
    if (!coin) return

    clearErrors()

    const updates = {
      nickname: data.nickname,
      legend_o: data.legend_o,
      legend_o_expanded: data.legend_o_expanded,
      legend_o_translation: data.legend_o_translation,
      desc_o: data.desc_o,
      legend_r: data.legend_r,
      legend_r_expanded: data.legend_r_expanded,
      legend_r_translation: data.legend_r_translation,
      desc_r: data.desc_r,
      flavour_text: data.flavour_text,
      deity_id: data.deity_id.length > 0 ? data.deity_id : null,
      devices: processArray(data.devicesRaw, true), // Convert to lowercase
      sets: processArray(data.setsRaw, false), // Keep original case for sets
    }

    try {
      await onSave(coin.id, updates)
      onClose()
    } catch (error) {
      console.error("Failed to save coin:", error)
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save changes. Please try again.",
      })
    }
  }

  const handleClose = () => handleUnsavedChanges(isDirty, onClose)

  if (!isOpen || !coin) return null

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title={`Edit Coin: ${coin.nickname || "Untitled"}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
        <FormErrorDisplay errors={errors} />

        {/* Nickname */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Nickname *
          </label>
          <input
            type="text"
            {...register("nickname", { required: "Nickname is required" })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Enter nickname"
          />
          {errors.nickname && (
            <p className="mt-1 text-sm text-red-600">
              {errors.nickname.message}
            </p>
          )}
        </div>

        {/* Legend O */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Obverse Legend
          </label>
          <input
            type="text"
            {...register("legend_o")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Enter obverse legend"
          />
        </div>

        {/* Legend O Expanded */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Obverse Legend Expanded
          </label>
          <textarea
            {...register("legend_o_expanded")}
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Enter expanded obverse legend"
          />
        </div>

        {/* Legend O Translation */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Obverse Legend Translation
          </label>
          <textarea
            {...register("legend_o_translation")}
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Enter obverse legend translation"
          />
        </div>

        {/* Obverse Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Obverse Description
          </label>
          <textarea
            {...register("desc_o")}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Describe what appears on the obverse"
          />
        </div>

        {/* Legend R */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Reverse Legend
          </label>
          <input
            type="text"
            {...register("legend_r")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Enter reverse legend"
          />
        </div>

        {/* Legend R Expanded */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Reverse Legend Expanded
          </label>
          <textarea
            {...register("legend_r_expanded")}
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Enter expanded reverse legend"
          />
        </div>

        {/* Legend R Translation */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Reverse Legend Translation
          </label>
          <textarea
            {...register("legend_r_translation")}
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Enter reverse legend translation"
          />
        </div>

        {/* Reverse Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Reverse Description
          </label>
          <textarea
            {...register("desc_r")}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Describe what appears on the reverse"
          />
        </div>

        {/* Flavour Text */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Flavour Text
          </label>
          <textarea
            {...register("flavour_text")}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="Additional context or notes"
          />
        </div>

        {/* God Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            God/Deity
          </label>

          <SimpleMultiSelect
            options={deityOptions}
            selectedValues={watch("deity_id")}
            onSelectionChange={(values) =>
              setValue("deity_id", values, { shouldDirty: true })
            }
            placeholder="Select deities..."
            className="w-full"
          />
        </div>

        {/* Devices */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Devices
          </label>
          <input
            type="text"
            {...register("devicesRaw")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="e.g., eagle, wreath, jupiter (comma separated)"
          />
          <p className="mt-1 text-sm text-gray-400">
            Enter devices separated by commas. Will be saved in lowercase.
          </p>
        </div>

        {/* Sets */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Sets
          </label>
          <input
            type="text"
            {...register("setsRaw")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            placeholder="e.g., Roman Imperial, Severan Dynasty (comma separated)"
          />
          <p className="mt-1 text-sm text-gray-400">
            Enter sets this coin belongs to, separated by commas
          </p>
        </div>

        {/* Error Message */}
        {errors.root && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {errors.root.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={!isDirty || isSaving}
            className="flex-1 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="flex-1 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </ModalWrapper>
  )
}
