"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAddMint } from "~/api/mints"
import { MintForm } from "~/components/forms/MintForm"
import type { MintFormInputData } from "~/lib/validations/mint-form"
import { mintFormSchema } from "~/lib/validations/mint-form"

export default function AddMintPage() {
  const router = useRouter()
  const addMintMutation = useAddMint()
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (formData: MintFormInputData) => {
    try {
      setMessage(null)
      // Validate and transform the form data
      const processedData = mintFormSchema.parse(formData)

      await addMintMutation.mutateAsync(processedData)

      setMessage("✅ Mint added successfully")
      setTimeout(() => {
        router.push("/admin")
      }, 1500)
    } catch (error) {
      console.error("Failed to add mint:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add mint"
      setMessage(`❌ ${errorMessage}`)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Mint</h1>
        <p className="text-muted-foreground mt-2">
          Add a new mint location to the database. Include historical context
          and archaeological evidence where available.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        {message && (
          <div
            className={`mb-4 rounded-md p-3 ${
              message.startsWith("✅")
                ? "border border-green-200 bg-green-50 text-green-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="rounded-lg border p-6">
          <MintForm
            onSubmit={handleSubmit}
            isLoading={addMintMutation.isPending}
            submitLabel="Add Mint"
          />
        </div>
      </div>
    </div>
  )
}
