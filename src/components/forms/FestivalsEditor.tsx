"use client"

import { StructuredDataEditor } from "./StructuredDataEditor"
import type { Festival } from "~/database/schema-deities"

type FestivalsEditorProps = {
  value?: string
  onChange: (jsonString: string) => void
  error?: string
  className?: string
}

const emptyFestival: Festival = {
  name: "",
  date: "",
  note: "",
}

const fields = [
  {
    key: "name",
    label: "Festival Name",
    placeholder: "e.g., Ides of Mars",
    required: true,
    colSpan: 4,
  },
  {
    key: "date",
    label: "Date (Optional)",
    placeholder: "03/15 (optional)",
    colSpan: 3,
  },
  {
    key: "note",
    label: "Note (Optional)",
    placeholder: "e.g., Celebrated in Rome",
    colSpan: 4,
  },
]

export function FestivalsEditor({
  value = "",
  onChange,
  error,
  className = "",
}: FestivalsEditorProps) {
  return (
    <StructuredDataEditor<Festival>
      title="Associated Festivals"
      value={value}
      onChange={onChange}
      error={error}
      className={className}
      fields={fields}
      emptyItem={emptyFestival}
      addButtonText="Add Festival"
      helpText="Define festivals associated with this deity. Each festival includes a name, optional date (MM/DD format), and optional note about the celebration."
    />
  )
}
