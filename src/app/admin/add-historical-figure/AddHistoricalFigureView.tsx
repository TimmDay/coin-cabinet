"use client"

import { useAddHistoricalFigure } from "~/api/historical-figures"
import { HistoricalFigureForm } from "./HistoricalFigureForm"
import { AddFormWrapper } from "~/components/forms"

export function AddHistoricalFigureView() {
  const addFigureMutation = useAddHistoricalFigure()

  return (
    <AddFormWrapper
      mutation={addFigureMutation}
      successMessage="✨ Historical figure added successfully"
      errorMessage="❌ Failed to add historical figure"
      loginRequiredMessage="❌ Please log in to add historical figures"
    >
      {({ onSubmit, isLoading }) => (
        <HistoricalFigureForm onSubmit={onSubmit} isLoading={isLoading} />
      )}
    </AddFormWrapper>
  )
}
