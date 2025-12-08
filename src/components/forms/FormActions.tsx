type FormActionsProps = {
  onCancel: () => void
  isDirty: boolean
  isSaving: boolean
  saveLabel?: string
  cancelLabel?: string
}

export function FormActions({
  onCancel,
  isDirty,
  isSaving,
  saveLabel = "Save Changes",
  cancelLabel = "Cancel",
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none"
        disabled={isSaving}
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        disabled={!isDirty || isSaving}
        className={`rounded-md px-6 py-2 text-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
          isDirty && !isSaving
            ? "bg-green-600 shadow-lg hover:bg-green-700 focus:ring-green-600"
            : "bg-purple-900 hover:bg-purple-900 focus:ring-purple-900"
        }`}
      >
        {isSaving ? "Saving..." : saveLabel}
      </button>
    </div>
  )
}
