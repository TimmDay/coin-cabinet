"use client"

import { StructuredDataEditor } from "./StructuredDataEditor"
import type { HistoricalSource } from "~/database/schema-historical-figures"

type HistoricalSourcesEditorProps = {
  value: string
  onChange: (value: string) => void
  error?: string
}

const emptySource: HistoricalSource = {
  citation: "",
  notes: "",
}

const fields = [
  {
    key: "citation",
    label: "Citation",
    placeholder: "e.g., Suetonius, Lives of the Caesars, Augustus 28",
    required: true,
    colSpan: 7,
  },
  {
    key: "notes",
    label: "Notes (Optional)",
    placeholder: "e.g., describes the monetary reforms...",
    colSpan: 4,
  },
]

export function HistoricalSourcesEditor({
  value,
  onChange,
  error,
}: HistoricalSourcesEditorProps) {
  return (
    <StructuredDataEditor<HistoricalSource>
      title="Historical Sources"
      value={value}
      onChange={onChange}
      error={error}
      fields={fields}
      emptyItem={emptySource}
      addButtonText="Add Source"
      helpText="Academic citations and historical references for this figure"
    />
  )
}
