"use client"

import { useAddDeity } from "~/api/deities"
import { AddFormWrapper } from "~/components/admin/shared"
import { DeityForm } from "~/components/forms/DeityForm"

export function AddDeityView() {
  const addDeityMutation = useAddDeity()

  return (
    <AddFormWrapper
      mutation={addDeityMutation}
      successMessage="✨ Deity added successfully to the pantheon"
      errorMessage="❌ Failed to add deity"
      loginRequiredMessage="❌ Please log in to add deities"
    >
      {({ onSubmit, isLoading }) => (
        <DeityForm onSubmit={onSubmit} isLoading={isLoading} />
      )}
    </AddFormWrapper>
  )
}
