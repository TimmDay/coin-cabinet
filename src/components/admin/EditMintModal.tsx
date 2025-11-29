"use client"

import React, { useState } from "react"
import { useUpdateMint } from "~/api/mints"
import { MintForm } from "~/components/forms/MintForm"
import type { Mint } from "~/database/schema-mints"
import type { MintFormInputData } from "~/lib/validations/mint-form"
import { mintFormSchema } from "~/lib/validations/mint-form"

type EditMintModalProps = {
  mint: Mint
  isOpen: boolean
  onClose: () => void
  onSuccess?: (message: string) => void
}

export function EditMintModal({
  mint,
  isOpen,
  onClose,
  onSuccess,
}: EditMintModalProps) {
  const updateMintMutation = useUpdateMint()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (formData: MintFormInputData) => {
    try {
      setErrorMessage(null)
      // Validate and transform the form data
      const processedData = mintFormSchema.parse(formData)

      await updateMintMutation.mutateAsync({
        id: mint.id,
        updates: processedData,
      })

      onSuccess?.("✅ Mint updated successfully")
      onClose()
    } catch (error) {
      console.error("Failed to update mint:", error)
      const message =
        error instanceof Error ? error.message : "Failed to update mint"
      setErrorMessage(message)
    }
  }

  const isLoading = updateMintMutation.isPending

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking on the backdrop itself, not on child elements
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="z-modal bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black p-4"
      onClick={handleBackdropClick}
    >
      <div className="somnus-card max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <div className="sticky top-0 border-b border-gray-200 bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Edit Mint: {mint.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="space-y-6">
            <MintForm
              mint={mint}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              submitLabel="Save Changes"
              showSubmitButton={false}
            />

            {/* Action Buttons matching deity modal */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // Trigger form submission - we'll need to update MintForm to expose this
                  const form = document.querySelector("form")!
                  if (form) {
                    const event = new Event("submit", {
                      bubbles: true,
                      cancelable: true,
                    })
                    form.dispatchEvent(event)
                  }
                }}
                disabled={isLoading}
                className="rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
