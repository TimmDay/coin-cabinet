"use client"

import { Copy } from "lucide-react"
import { useState } from "react"
import { generateImageId } from "~/lib/utils/image-id-generation"

type GeneratedImageIdHelperProps = {
  /** Watch function from react-hook-form to get current form values */
  watch: (fieldName: string) => string | undefined;
  /** View type - "o", "r", "sketch-o", "sketch-r", "zoom-o", "zoom-r" */
  view: "o" | "r" | "sketch-o" | "sketch-r" | "zoom-o" | "zoom-r";
  /** Whether Tim took the photos (defaults to false) */
  timTookPhotos?: boolean;
};

export function GeneratedImageIdHelper({
  watch,
  view,
  timTookPhotos = false,
}: GeneratedImageIdHelperProps) {
  const [copied, setCopied] = useState(false)

  // Watch relevant form fields
  const nickname = watch("nickname") ?? ""
  const denomination = watch("denomination") ?? ""
  const purchaseDate = watch("purchase_date") ?? ""
  const vendor = watch("purchase_vendor") ?? ""

  const generatedId = generateImageId(
    nickname,
    denomination,
    purchaseDate,
    vendor,
    view,
    timTookPhotos,
  )

  // Don't show anything if we can't generate an ID
  if (!generatedId) return null

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
      <span className="font-mono select-all">{generatedId}</span>
      <button
        type="button"
        onClick={copyToClipboard}
        className="flex items-center gap-1 rounded px-1 py-0.5 hover:bg-slate-700/50 focus:ring-1 focus:ring-amber-400 focus:outline-none"
        title="Copy to clipboard"
      >
        {copied ? (
          <span className="text-green-400">✓</span>
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </button>
    </div>
  )
}
