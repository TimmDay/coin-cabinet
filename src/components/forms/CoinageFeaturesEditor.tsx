"use client"

import { StructuredDataEditor } from "./StructuredDataEditor"
import type { CoinageFeature } from "~/database/schema-deities"

type CoinageFeaturesEditorProps = {
  value: string
  onChange: (value: string) => void
  error?: string
}

const emptyFeature: CoinageFeature = {
  name: "",
  alt_names: [],
  notes: "",
}

const fields = [
  {
    key: "name",
    label: "Name",
    placeholder: "eagle, thunderbolt, caduceus...",
    required: true,
    colSpan: 4,
  },
  {
    key: "alt_names",
    label: "Alternative Names",
    placeholder: "aquila, fulmen (comma separated)",
    type: "array" as const,
    colSpan: 4,
  },
  {
    key: "notes",
    label: "Notes",
    placeholder: "often perched on scepter...",
    colSpan: 3,
  },
]

export function CoinageFeaturesEditor({
  value,
  onChange,
  error,
}: CoinageFeaturesEditorProps) {
  return (
    <StructuredDataEditor<CoinageFeature>
      title="Coinage Features"
      value={value}
      onChange={onChange}
      error={error}
      fields={fields}
      emptyItem={emptyFeature}
      addButtonText="Add Feature"
      helpText="Define iconographic elements that appear on coins featuring this deity"
    />
  )
}
