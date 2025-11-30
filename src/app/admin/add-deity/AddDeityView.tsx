"use client"

import { useAddDeity } from "~/api/deities"
import { DeityForm } from "~/app/admin/add-deity/DeityForm"
import { AddFormWrapper } from "~/components/forms"

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
