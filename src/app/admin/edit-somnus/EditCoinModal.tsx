"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { GeneratedImageIdHelper } from "~/components/ui/GeneratedImageIdHelper"
import { SimpleMultiSelect } from "~/components/ui/SimpleMultiSelect"
import { Select } from "~/components/ui/Select"
import type { SomnusCollection } from "~/database/schema-somnus-collection"
import type { CoinFormData } from "~/lib/validations/coin-form"

import { useDeityOptions } from "~/hooks/useDeityOptions"
import { useHistoricalFigureOptions } from "~/hooks/useHistoricalFigureOptions"
import { useTimelines } from "~/api/timelines"
import { NotableFeaturesEditor } from "~/components/forms/NotableFeaturesEditor"
import {
  FormErrorDisplay,
  handleUnsavedChanges,
  ModalWrapper,
} from "../../../components/forms"
import {
  authorityOptions,
  civilizationOptions,
  civSpecificOptions,
  denominationOptions,
  dieAxisOptions,
} from "./coin-form-options"

// Extended CoinFormData with raw string fields for form inputs
type EditCoinFormData = CoinFormData & {
  setsRaw: string
  bpRouteRaw?: string | null
}

type EditCoinModalProps = {
  isOpen: boolean
  onClose: () => void
  coin: SomnusCollection | null
  onSave: (id: number, data: CoinFormData) => Promise<void>
  isSaving?: boolean
  mode: "create" | "edit"
}

// Helper function to transform coin data for form
const createCoinFormData = (
  coin: SomnusCollection | null,
): EditCoinFormData => ({
  // Required fields - default to empty string
  nickname: coin?.nickname ?? "",
  authority: coin?.authority ?? "",
  denomination: coin?.denomination ?? "",
  civ: coin?.civ ?? "",
  metal: coin?.metal ?? "",

  // Optional fields - default to undefined
  civ_specific: coin?.civ_specific ?? undefined,
  diameter: coin?.diameter ?? undefined,
  mass: coin?.mass ?? undefined,
  die_axis: coin?.die_axis ?? undefined,
  silver_content: coin?.silver_content ?? undefined,
  mint: coin?.mint ?? undefined,
  mint_year_earliest: coin?.mint_year_earliest ?? undefined,
  mint_year_latest: coin?.mint_year_latest ?? undefined,
  reference: coin?.reference ?? undefined,
  reference_link: coin?.reference_link ?? undefined,

  // Text fields - default to empty string for better UX
  legend_o: coin?.legend_o ?? "",
  legend_o_expanded: coin?.legend_o_expanded ?? "",
  legend_o_translation: coin?.legend_o_translation ?? "",
  desc_o: coin?.desc_o ?? "",
  legend_r: coin?.legend_r ?? "",
  legend_r_expanded: coin?.legend_r_expanded ?? "",
  legend_r_translation: coin?.legend_r_translation ?? "",
  desc_r: coin?.desc_r ?? "",
  flavour_text: coin?.flavour_text ?? "",

  // Arrays and special fields
  deity_id: coin?.deity_id ?? undefined,
  historical_figures_id: coin?.historical_figures_id ?? undefined,
  timelines_id: coin?.timelines_id ?? undefined,
  sets: coin?.sets ?? undefined,
  notable_features: coin?.notable_features ?? undefined,
  bpRoute: coin?.bpRoute ?? undefined,
  secondary_info: undefined,

  // Raw string fields for form inputs
  setsRaw: coin?.sets?.join(", ") ?? "",
  // Purchase info
  purchase_type:
    (coin?.purchase_type as
      | "auction"
      | "auction aftermarket"
      | "retail"
      | "private"
      | "gift"
      | "inheritance"
      | "other") ?? "other",
  purchase_date: coin?.purchase_date ?? undefined,
  price_aud: coin?.price_aud ?? undefined,
  price_shipping_aud: coin?.price_shipping_aud ?? undefined,
  purchase_vendor: coin?.purchase_vendor ?? undefined,
  purchase_link: coin?.purchase_link ?? undefined,
  vendor_grading_notes: coin?.vendor_grading_notes ?? undefined,
  auction_name: coin?.auction_name ?? undefined,
  auction_lot: coin?.auction_lot ?? undefined,

  // Image links
  image_link_o: coin?.image_link_o ?? undefined,
  image_link_r: coin?.image_link_r ?? undefined,
  image_link_altlight_o: coin?.image_link_altlight_o ?? undefined,
  image_link_altlight_r: coin?.image_link_altlight_r ?? undefined,
  image_link_sketch_o: coin?.image_link_sketch_o ?? undefined,
  image_link_sketch_r: coin?.image_link_sketch_r ?? undefined,
  image_link_zoom_o: coin?.image_link_zoom_o ?? undefined,
  image_link_zoom_r: coin?.image_link_zoom_r ?? undefined,

  // Additional fields
  antiquities_register: coin?.antiquities_register ?? undefined,
  provenance: coin?.provenance ?? undefined,
  notes: coin?.notes ?? undefined,
  notes_history: coin?.notes_history ?? undefined,
  ex_collection: coin?.ex_collection ?? undefined,
  isHidden: Boolean(coin?.isHidden),
  bpRouteRaw: coin?.bpRoute?.join(", ") ?? "",
})

export function EditCoinModal({
  isOpen,
  onClose,
  coin,
  onSave,
  isSaving = false,
  mode,
}: EditCoinModalProps) {
  const { options: deityOptions } = useDeityOptions()
  const { options: historicalFigureOptions } = useHistoricalFigureOptions()
  const { data: allTimelines = [] } = useTimelines()

  // Transform timeline data for MultiSelect
  const timelineOptions = allTimelines.map((timeline) => ({
    value: timeline.id.toString(),
    label: timeline.name,
  }))
  const [timTookPhotos, setTimTookPhotos] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    setError,
    clearErrors,
    setValue,
    watch,
    reset,
  } = useForm<EditCoinFormData>({
    ...(mode === "create"
      ? { defaultValues: createCoinFormData(null) }
      : { values: createCoinFormData(coin) }),
  })

  // Inline helper
  const processArray = (str: string, lower = false) => {
    const arr = str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (lower ? s.toLowerCase() : s))
    return arr.length > 0 ? arr : undefined
  }

  const onSubmit = async (data: EditCoinFormData) => {
    if (mode === "edit" && !coin) return

    clearErrors()

    const updates = {
      nickname: data.nickname,
      authority: data.authority,
      denomination: data.denomination,
      civ: data.civ,
      civ_specific: data.civ_specific,
      diameter: data.diameter,
      mass: data.mass,
      die_axis: data.die_axis,
      metal: data.metal,
      silver_content: data.silver_content,
      mint: data.mint,
      mint_year_earliest: data.mint_year_earliest,
      mint_year_latest: data.mint_year_latest,
      reference: data.reference,
      reference_link: data.reference_link,
      legend_o: data.legend_o,
      legend_o_expanded: data.legend_o_expanded,
      legend_o_translation: data.legend_o_translation,
      desc_o: data.desc_o,
      legend_r: data.legend_r,
      legend_r_expanded: data.legend_r_expanded,
      legend_r_translation: data.legend_r_translation,
      desc_r: data.desc_r,
      flavour_text: data.flavour_text,
      deity_id:
        data.deity_id && data.deity_id.length > 0 ? data.deity_id : undefined,
      historical_figures_id:
        data.historical_figures_id && data.historical_figures_id.length > 0
          ? data.historical_figures_id
          : undefined,
      timelines_id:
        data.timelines_id && data.timelines_id.length > 0
          ? data.timelines_id
          : undefined,
      sets: processArray(data.setsRaw, false), // Keep original case for sets
      notable_features:
        data.notable_features && data.notable_features.length > 0
          ? data.notable_features
          : undefined,
      purchase_type: data.purchase_type,
      purchase_date: data.purchase_date,
      price_aud: data.price_aud,
      price_shipping_aud: data.price_shipping_aud,
      purchase_vendor: data.purchase_vendor,
      purchase_link: data.purchase_link,
      vendor_grading_notes: data.vendor_grading_notes,
      auction_name: data.auction_name,
      auction_lot: data.auction_lot,
      image_link_o: data.image_link_o,
      image_link_r: data.image_link_r,
      image_link_altlight_o: data.image_link_altlight_o,
      image_link_altlight_r: data.image_link_altlight_r,
      image_link_sketch_o: data.image_link_sketch_o,
      image_link_sketch_r: data.image_link_sketch_r,
      image_link_zoom_o: data.image_link_zoom_o,
      image_link_zoom_r: data.image_link_zoom_r,
      antiquities_register: data.antiquities_register,
      provenance: data.provenance,
      notes: data.notes,
      notes_history: data.notes_history,
      bpRoute: processArray(data.bpRouteRaw ?? "", false),
      ex_collection: data.ex_collection,
      isHidden: data.isHidden,
    }

    try {
      if (mode === "create") {
        await onSave(0, updates as CoinFormData)
        // Clear form after successful creation
        reset()
      } else {
        await onSave(coin!.id, updates as CoinFormData)
      }
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

  if (!isOpen) return null

  const modalTitle =
    mode === "create"
      ? "Add New Coin"
      : `Edit Coin: ${coin?.nickname ?? "Untitled"}`

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose} title={modalTitle}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
        <FormErrorDisplay errors={errors} />

        {/* Basic Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-200">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Nickname *
              </label>
              <input
                type="text"
                {...register("nickname", { required: "Nickname is required" })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="Enter nickname"
              />
              {errors.nickname && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nickname.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Authority *
              </label>
              <Select
                {...register("authority")}
                value={watch("authority")}
                options={authorityOptions}
                placeholder="Select authority"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Civilization *
              </label>
              <Select
                {...register("civ")}
                value={watch("civ")}
                options={civilizationOptions}
                placeholder="Select Civilization"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Civilization Details
              </label>
              <Select
                {...register("civ_specific")}
                value={watch("civ_specific")}
                options={
                  watch("civ") &&
                  civSpecificOptions[
                    watch("civ") as keyof typeof civSpecificOptions
                  ]
                    ? civSpecificOptions[
                        watch("civ") as keyof typeof civSpecificOptions
                      ]
                    : []
                }
                placeholder={
                  watch("civ") &&
                  civSpecificOptions[
                    watch("civ") as keyof typeof civSpecificOptions
                  ]
                    ? "Select details"
                    : "Select civilization first"
                }
                disabled={
                  !watch("civ") ||
                  !civSpecificOptions[
                    watch("civ") as keyof typeof civSpecificOptions
                  ]
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Denomination *
              </label>
              <Select
                {...register("denomination")}
                value={watch("denomination")}
                options={denominationOptions}
                placeholder="Select denomination"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Historical Figures
              </label>
              <SimpleMultiSelect
                options={historicalFigureOptions}
                selectedValues={watch("historical_figures_id") ?? []}
                onSelectionChange={(values) =>
                  setValue("historical_figures_id", values, {
                    shouldDirty: true,
                  })
                }
                placeholder="Select historical figures..."
              />
            </div>
          </div>

          {/* Timelines and Deities */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Timelines
              </label>
              <SimpleMultiSelect
                options={timelineOptions}
                selectedValues={(watch("timelines_id") ?? []).map((id) =>
                  id.toString(),
                )}
                onSelectionChange={(values) =>
                  setValue(
                    "timelines_id",
                    values.map((id) => parseInt(id, 10)),
                    { shouldDirty: true },
                  )
                }
                placeholder="Select timelines..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Deities
              </label>
              <SimpleMultiSelect
                options={deityOptions}
                selectedValues={watch("deity_id") ?? []}
                onSelectionChange={(values) =>
                  setValue("deity_id", values, { shouldDirty: true })
                }
                placeholder="Select deities..."
              />
            </div>
          </div>
        </div>

        {/* Coin Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-200">
            Coin Details
          </h3>

          {/* Physical Properties */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Diameter (mm)
              </label>
              <input
                type="number"
                step="0.1"
                {...register("diameter", { valueAsNumber: true })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., 19.2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Weight (grams)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("mass", { valueAsNumber: true })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., 3.45"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Die Axis
              </label>
              <Select
                {...register("die_axis")}
                value={watch("die_axis")}
                options={dieAxisOptions}
                placeholder="Select axis"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Mint Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Mint
              </label>
              <input
                type="text"
                {...register("mint")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., Rome"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Mint Year Earliest
              </label>
              <input
                type="number"
                {...register("mint_year_earliest", { valueAsNumber: true })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., 170"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Mint Year Latest
              </label>
              <input
                type="number"
                {...register("mint_year_latest", { valueAsNumber: true })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., 172"
              />
            </div>
          </div>

          {/* Reference */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Reference
              </label>
              <input
                type="text"
                {...register("reference")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., RIC IV 245"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Reference Link
              </label>
              <input
                type="url"
                {...register("reference_link")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., https://reference.com"
              />
            </div>
          </div>

          {/* Notable Features Section */}
          <div className="space-y-4">
            <p className="mb-2 text-sm text-slate-400">
              Particular elements on this coin that are worth pointing out
            </p>

            <NotableFeaturesEditor
              value={watch("notable_features") ?? []}
              onChange={(features) =>
                setValue("notable_features", features, { shouldDirty: true })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Metal *
              </label>
              <Select
                {...register("metal")}
                value={watch("metal")}
                options={[
                  { value: "Silver", label: "Silver" },
                  { value: "Bronze", label: "Bronze" },
                  { value: "Billon", label: "Billon" },
                  { value: "Gold", label: "Gold" },
                  { value: "Copper", label: "Copper" },
                  { value: "Electrum", label: "Electrum" },
                ]}
                placeholder="Select metal"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Silver Content
              </label>
              <input
                type="text"
                {...register("silver_content")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., 93.1-98"
              />
            </div>
          </div>
        </div>

        {/* Obverse and Reverse Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-200">
            Obverse and Reverse Details
          </h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Obverse Column */}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Obverse Legend
                </label>
                <input
                  type="text"
                  {...register("legend_o")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                  placeholder="Enter obverse legend"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Obverse Legend Expanded
                </label>
                <textarea
                  {...register("legend_o_expanded")}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                  placeholder="Enter expanded obverse legend"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Obverse Legend Translation
                </label>
                <textarea
                  {...register("legend_o_translation")}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                  placeholder="Enter obverse legend translation"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Obverse Description
                </label>
                <textarea
                  {...register("desc_o")}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                  placeholder="Describe what appears on the obverse"
                />
              </div>
            </div>

            {/* Reverse Column */}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Reverse Legend
                </label>
                <input
                  type="text"
                  {...register("legend_r")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                  placeholder="Enter reverse legend"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Reverse Legend Expanded
                </label>
                <textarea
                  {...register("legend_r_expanded")}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                  placeholder="Enter expanded reverse legend"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Reverse Legend Translation
                </label>
                <textarea
                  {...register("legend_r_translation")}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                  placeholder="Enter reverse legend translation"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Reverse Description
                </label>
                <textarea
                  {...register("desc_r")}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                  placeholder="Describe what appears on the reverse"
                />
              </div>
            </div>
          </div>

          {/* Flavour Text */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Flavour Text
            </label>
            <textarea
              {...register("flavour_text")}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="Additional context or notes"
            />
          </div>

          {/* Sets */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Sets
            </label>
            <input
              type="text"
              {...register("setsRaw")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="e.g., Roman Imperial, Severan Dynasty (comma separated)"
            />
            <p className="mt-1 text-sm text-gray-400">
              Enter sets this coin belongs to, separated by commas
            </p>
          </div>
        </div>

        {/* Purchase Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-200">
            Purchase Information
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Purchase Type {mode === "create" && "*"}
              </label>
              <Select
                {...register("purchase_type", {
                  required:
                    mode === "create" ? "Purchase type is required" : false,
                })}
                value={watch("purchase_type")}
                options={[
                  { value: "auction", label: "Auction" },
                  {
                    value: "auction aftermarket",
                    label: "Auction Aftermarket",
                  },
                  { value: "retail", label: "Retail" },
                  { value: "private", label: "Private Sale" },
                  { value: "gift", label: "Gift" },
                  { value: "inheritance", label: "Inheritance" },
                  { value: "other", label: "Other" },
                ]}
                placeholder="Select purchase type"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              />
              {errors.purchase_type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.purchase_type.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Purchase Date
              </label>
              <input
                type="date"
                {...register("purchase_date")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Price (AUD)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price_aud", {
                  setValueAs: (v) =>
                    v === "" || v === null ? undefined : Number(v) || undefined,
                })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., 125.50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Shipping (AUD)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price_shipping_aud", {
                  setValueAs: (v) =>
                    v === "" || v === null ? undefined : Number(v) || undefined,
                })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., 15.00"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Vendor
              </label>
              <input
                type="text"
                {...register("purchase_vendor")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., Heritage Auctions"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Purchase Link
              </label>
              <input
                type="url"
                {...register("purchase_link")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., https://auction.com/lot/123"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Auction Name
              </label>
              <input
                type="text"
                {...register("auction_name")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., Ancient Coins Auction #45"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Auction Lot Number
              </label>
              <input
                type="number"
                {...register("auction_lot", {
                  setValueAs: (v) =>
                    v === "" || v === null ? undefined : Number(v) || undefined,
                })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., 123"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Vendor Grading Notes
            </label>
            <textarea
              {...register("vendor_grading_notes")}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="Enter vendor's grading or condition notes"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-slate-300">
              <input
                type="checkbox"
                {...register("ex_collection")}
                className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-900"
              />
              Ex Collection
            </label>
          </div>
        </div>

        {/* Images Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-200">Image slugs</h3>

          {/* Tim took photos checkbox */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={timTookPhotos}
                onChange={(e) => setTimTookPhotos(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800/50 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-800"
              />
              Tim took these photos
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Obverse Image ID
              </label>
              <input
                type="text"
                {...register("image_link_o")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., marcus_aurelius_denarius_o"
              />
              <GeneratedImageIdHelper
                watch={watch}
                view="o"
                timTookPhotos={timTookPhotos}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Reverse Image ID
              </label>
              <input
                type="text"
                {...register("image_link_r")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="e.g., marcus_aurelius_denarius_r"
              />
              <GeneratedImageIdHelper
                watch={watch}
                view="r"
                timTookPhotos={timTookPhotos}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Obverse Alt Light
              </label>
              <input
                type="text"
                {...register("image_link_altlight_o")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="Alternative lighting obverse image"
              />
              <GeneratedImageIdHelper
                watch={watch}
                view="altlight-o"
                timTookPhotos={timTookPhotos}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Reverse Alt Light
              </label>
              <input
                type="text"
                {...register("image_link_altlight_r")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="Alternative lighting reverse image"
              />
              <GeneratedImageIdHelper
                watch={watch}
                view="altlight-r"
                timTookPhotos={timTookPhotos}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Obverse Sketch
              </label>
              <input
                type="text"
                {...register("image_link_sketch_o")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="Sketch/drawing of obverse"
              />
              <GeneratedImageIdHelper
                watch={watch}
                view="sketch-o"
                timTookPhotos={timTookPhotos}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Reverse Sketch
              </label>
              <input
                type="text"
                {...register("image_link_sketch_r")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="Sketch/drawing of reverse"
              />
              <GeneratedImageIdHelper
                watch={watch}
                view="sketch-r"
                timTookPhotos={timTookPhotos}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Obverse Zoom
              </label>
              <input
                type="text"
                {...register("image_link_zoom_o")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="High-resolution zoom obverse"
              />
              <GeneratedImageIdHelper
                watch={watch}
                view="zoom-o"
                timTookPhotos={timTookPhotos}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Reverse Zoom
              </label>
              <input
                type="text"
                {...register("image_link_zoom_r")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
                placeholder="High-resolution zoom reverse"
              />
              <GeneratedImageIdHelper
                watch={watch}
                view="zoom-r"
                timTookPhotos={timTookPhotos}
              />
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-200">
            Additional Information
          </h3>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Antiquities Register
            </label>
            <input
              type="text"
              {...register("antiquities_register")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="Registration number or details"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Provenance
            </label>
            <textarea
              {...register("provenance")}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="Known history and ownership of the coin"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              General Notes
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="Additional notes about the coin"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Historical Notes
            </label>
            <textarea
              {...register("notes_history")}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="Historical context and significance"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Blog Post Route
            </label>
            <input
              type="text"
              {...register("bpRouteRaw")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
              placeholder="e.g., marcus-aurelius, antoninus-pius (comma separated)"
            />
            <p className="mt-1 text-sm text-gray-400">
              Blog post routes this coin should appear in, separated by commas
            </p>
          </div>

          {/* Hidden Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isHidden"
              {...register("isHidden")}
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label
              htmlFor="isHidden"
              className="text-sm font-medium text-slate-300"
            >
              Hide from public display
            </label>
            <p className="text-sm text-gray-400">
              (Hidden coins are only visible in admin interface)
            </p>
          </div>
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

        <FormActions
          onCancel={handleClose}
          isDirty={isDirty}
          isSaving={isSaving}
          saveLabel={mode === "create" ? "Add Coin" : "Save Changes"}
        />
      </form>
    </ModalWrapper>
  )
}
