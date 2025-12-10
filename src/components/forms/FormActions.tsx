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
    <>
      {/* Mobile: Fixed actions at bottom of viewport - extends below viewport */}
      <div className="mobile-form-actions fixed inset-x-0 z-10 border-t border-gray-200 bg-slate-800 sm:hidden">
        <div className="mobile-form-actions-padding flex justify-center gap-3 p-4">
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
      </div>

      {/* Desktop: Inline actions */}
      <div className="hidden justify-end gap-3 pt-4 sm:flex">
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

      {/* Mobile: Add bottom padding to prevent content from being hidden behind fixed actions */}
      <div className="h-20 sm:hidden" />
    </>
  )
}
