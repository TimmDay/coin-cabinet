"use client"

import { useAddSomnusCoin } from "~/api/somnus-collection"
import { CoinForm } from "~/app/admin/add-coin/CoinForm"
import { AddFormWrapper } from "~/components/forms"

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
