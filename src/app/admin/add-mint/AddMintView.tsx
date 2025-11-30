"use client"

import { useRouter } from "next/navigation"
import { useAddMint } from "~/api/mints"
import { MintForm } from "~/app/admin/add-mint/MintForm"
import { AddFormWrapper } from "~/components/forms/AddFormWrapper"
import type { MintFormInputData } from "~/lib/validations/mint-form"
import { mintFormSchema } from "~/lib/validations/mint-form"

export function AddMintView() {
  const router = useRouter()
  const addMintMutation = useAddMint()

  // Transform function to handle the form data structure differences
  const handleFormSubmit = async (formData: MintFormInputData) => {
    // Validate and transform the form data to match the API expectation
    const processedData = mintFormSchema.parse(formData)
    return addMintMutation.mutateAsync(processedData)
  }

  return (
    <AddFormWrapper
      mutation={{ ...addMintMutation, mutateAsync: handleFormSubmit }}
      successMessage="🪙 Mint added successfully"
      errorMessage="❌ Failed to add mint"
      loginRequiredMessage="❌ Please log in to add mints"
      autoRedirect={{
        enabled: true,
        delay: 1500,
        path: "/admin",
        router,
      }}
    >
      {({ onSubmit, isLoading }) => (
        <MintForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          submitLabel="Add Mint"
        />
      )}
    </AddFormWrapper>
  )
}
