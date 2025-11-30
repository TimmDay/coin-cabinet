"use client"

import { useRouter } from "next/navigation"
import { useAddPlace } from "~/api/places"
import { PlaceForm } from "~/components/forms/PlaceForm"
import { AddFormWrapper } from "~/components/forms/AddFormWrapper"
import {
  placeFormSchema,
  type PlaceFormInputData,
} from "~/lib/validations/place-form"

export function AddPlaceView() {
  const router = useRouter()
  const addPlaceMutation = useAddPlace()

  // Transform function to handle the form data structure differences
  const handleFormSubmit = async (formData: PlaceFormInputData) => {
    // Validate and transform the form data to match the API expectation
    const processedData = placeFormSchema.parse(formData)
    return addPlaceMutation.mutateAsync(processedData)
  }

  return (
    <AddFormWrapper
      mutation={{ ...addPlaceMutation, mutateAsync: handleFormSubmit }}
      successMessage="🏛️ Place added successfully"
      errorMessage="❌ Failed to add place"
      loginRequiredMessage="❌ Please log in to add places"
      autoRedirect={{
        enabled: true,
        delay: 1500,
        path: "/admin",
        router,
      }}
    >
      {({ onSubmit, isLoading }) => (
        <PlaceForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          submitLabel="Add Place"
        />
      )}
    </AddFormWrapper>
  )
}
