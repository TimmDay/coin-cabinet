"use client"

import { StructuredDataEditor } from "./StructuredDataEditor"
import type { Event } from "~/data/timelines/types"
import { usePlaces } from "~/api/places"

type TimelineEventsEditorProps = {
  value?: string
  onChange: (jsonString: string) => void
  error?: string
  className?: string
}

const emptyEvent: Event = {
  kind: "other",
  name: "",
  year: 0, // Default year, will be edited by user
  description: "",
  source: "",
  place: "",
  place_id: "",
}

const fields = [
  {
    key: "kind",
    label: "Kind",
    type: "searchable-select" as const,
    options: [
      "birth",
      "death",
      "made-emperor",
      "military",
      "political",
      "family",
      "coin-minted",
      "unrest",
      "other",
    ],
    required: true,
    colSpan: 3,
  },
  {
    key: "year",
    label: "Year",
    type: "number" as const,
    placeholder: "year",
    required: true,
    colSpan: 2,
  },
  {
    key: "name",
    label: "Event Name",
    placeholder: "max 3 words event title",
    required: true,
    colSpan: 7,
  },
  {
    key: "description",
    label: "Description",
    placeholder: "description of the event",
    colSpan: 9,
  },
  {
    key: "source",
    label: "Source",
    placeholder: "Historical source",
    colSpan: 3,
  },
  {
    key: "place_id",
    label: "Select Place",
    type: "place-selector" as const,
    placeholder: "Choose from existing places...",
    colSpan: 4,
  },
  {
    key: "place",
    label: "Place Name",
    placeholder: "e.g., Rome, Jerusalem",
    colSpan: 4,
  },
  {
    key: "lat",
    label: "Latitude",
    type: "number" as const,
    placeholder: "41.9028",
    colSpan: 2,
  },
  {
    key: "lng",
    label: "Longitude",
    type: "number" as const,
    placeholder: "12.4964",
    colSpan: 2,
  },
]

export function TimelineEventsEditor({
  value = "",
  onChange,
  error,
  className = "",
}: TimelineEventsEditorProps) {
  const { data: places = [], isLoading: placesLoading } = usePlaces()

  return (
    <StructuredDataEditor<Event>
      title="Timeline Events"
      value={value}
      onChange={onChange}
      error={error}
      className={className}
      fields={fields}
      emptyItem={emptyEvent}
      addButtonText="Add Event"
      helpText="Define historical events in chronological order. Each event requires a kind (type), name, and year. Use negative years for BCE dates. Optional fields include description, source, place name, and coordinates."
      places={places}
      placesLoading={placesLoading}
    />
  )
}
