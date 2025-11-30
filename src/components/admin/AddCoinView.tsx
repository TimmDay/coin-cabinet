"use client"

import { useAddSomnusCoin } from "~/api/somnus-collection"
import { AddFormWrapper } from "~/components/admin/shared"
import { CoinForm } from "~/components/forms/CoinForm"

export function AddCoinView() {
  const addCoinMutation = useAddSomnusCoin()

  return (
    <AddFormWrapper
      mutation={addCoinMutation}
      successMessage="🌙 Somnus accepts your offering"
      errorMessage="❌ Failed to add coin to collection"
      loginRequiredMessage="❌ Please log in to add coins to your collection"
    >
      {({ onSubmit, isLoading }) => (
        <CoinForm onSubmit={onSubmit} isLoading={isLoading} />
      )}
    </AddFormWrapper>
  )
}
