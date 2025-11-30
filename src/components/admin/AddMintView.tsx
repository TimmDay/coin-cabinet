"use client"

import { useRouter } from "next/navigation"
import { useAddMint } from "~/api/mints"
import { AddFormWrapper } from "~/components/admin/shared"
import { MintForm } from "~/components/forms/MintForm"

export function AddMintView() {
  const router = useRouter()
  const addMintMutation = useAddMint()

  return (
    <AddFormWrapper
      mutation={addMintMutation}
      successMessage="✅ Mint added successfully"
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