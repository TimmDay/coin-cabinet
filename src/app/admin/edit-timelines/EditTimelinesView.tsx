"use client"

import { useState, useEffect } from "react"
import {
  useTimelines,
  useUpdateTimeline,
  useDeleteTimeline,
  useAddTimeline,
} from "~/api/timelines"
import type { Timeline } from "~/database/schema-timelines"
import type { TimelineFormData } from "~/database/schema-timelines"
import type { Event } from "~/data/timelines/types"
import { formatYear } from "~/lib/utils/date-formatting"
import { GenericEditView } from "~/components/admin/GenericEditView"
import { useEditModal } from "~/hooks/useEditModal"
import { EditTimelineModal } from "./EditTimelineModal"

export function EditTimelinesView() {
  const dataQuery = useTimelines()
  const updateMutation = useUpdateTimeline()
  const deleteMutation = useDeleteTimeline()
  const addMutation = useAddTimeline()

  // State for create modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createMessage, setCreateMessage] = useState("")
  const [cacheRefreshKey, setCacheRefreshKey] = useState(0)

  const {
    message,
    selectedItemId,
    isModalOpen,
    handleItemSelect,
    handleModalClose,
    handleSuccess,
  } = useEditModal<Timeline>()

  // Force modal recreation when data changes - enhanced for mobile
  useEffect(() => {
    setCacheRefreshKey(Date.now())

    // On mobile, also force a state update after cache refresh
    if (
      typeof window !== "undefined" &&
      /Mobi|Android/i.test(navigator.userAgent)
    ) {
      // Small delay to ensure React has processed the data change
      const timer = setTimeout(() => {
        setCacheRefreshKey(Date.now())
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [dataQuery.data, dataQuery.dataUpdatedAt])

  // Handle create modal
  const handleCreateModalOpen = () => setIsCreateModalOpen(true)
  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false)
    setCreateMessage("")
  }
  const handleCreateSuccess = (message: string) => {
    setCreateMessage(message)
    setTimeout(() => setCreateMessage(""), 3000)
  }

  // Handle delete
  const handleDelete = async (timeline: Timeline) => {
    if (!confirm(`Are you sure you want to delete ${timeline.name}?`)) return

    try {
      await deleteMutation.mutateAsync(timeline.id)
      handleSuccess(`✅ ${timeline.name} deleted successfully`)
    } catch (error) {
      console.error("Delete error:", error)
      handleSuccess(`❌ Failed to delete ${timeline.name}`)
    }
  }

  // Filter timelines based on name
  const filterFunction = (item: Timeline, filterTerm: string) => {
    if (!filterTerm.trim()) return true

    const searchTerm = filterTerm.toLowerCase()
    const nameMatch = item.name?.toLowerCase().includes(searchTerm) ?? false

    return nameMatch
  }

  // Helper function to get timeline metadata
  const getTimelineMetadata = (timeline: Timeline) => {
    const events = timeline.timeline || []
    const years = events
      .map((event: Event) => event.year)
      .filter((year): year is number => typeof year === "number")
    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)
    const yearRange =
      minYear === maxYear
        ? formatYear(minYear)
        : `${formatYear(minYear)} - ${formatYear(maxYear)}`

    return {
      eventCount: events.length,
      yearRange: years.length > 0 ? yearRange : "No dates",
    }
  }

  const renderListItem = (item: Timeline) => {
    const metadata = getTimelineMetadata(item)

    return (
      <div className="flex w-full items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white">{item.name}</h3>
          <p className="text-sm text-gray-400">
            {metadata.eventCount} events • {metadata.yearRange}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            void handleDelete(item)
          }}
          className="mr-3 rounded p-1 text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
          title={`Delete ${item.name}`}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    )
  }

  const handleModalSave = async (id: number, updates: Partial<Timeline>) => {
    try {
      await updateMutation.mutateAsync({ id, updates })

      // Force immediate cache refresh key update for mobile
      setCacheRefreshKey(Date.now())

      // On mobile, force additional data refetch
      if (
        typeof window !== "undefined" &&
        /Mobi|Android/i.test(navigator.userAgent)
      ) {
        setTimeout(() => {
          void dataQuery.refetch()
          setCacheRefreshKey(Date.now())
        }, 100)
      }

      handleSuccess("✅ Timeline updated successfully")
    } catch (error) {
      console.error("Error saving:", error)
      handleSuccess("❌ Failed to save changes")
      throw error // Re-throw so modal can handle it
    }
  }

  const renderModal = (selectedTimeline: Timeline | null) => {
    return (
      <>
        {/* Edit Modal */}
        {selectedTimeline && (
          <EditTimelineModal
            key={`timeline-${selectedTimeline.id}-${selectedTimeline.updated_at}-${cacheRefreshKey}-${dataQuery.dataUpdatedAt}`}
            isOpen={isModalOpen}
            onClose={handleModalClose}
            timeline={selectedTimeline}
            onSave={handleModalSave}
            isSaving={updateMutation.isPending}
          />
        )}
      </>
    )
  }

  // Handle create save
  const handleCreateSave = async (
    id: number,
    data: Partial<Timeline> | TimelineFormData,
  ) => {
    try {
      await addMutation.mutateAsync(data as TimelineFormData)
      handleCreateSuccess("✅ Timeline added successfully")
    } catch (error) {
      console.error("Error adding timeline:", error)
      throw error // Re-throw so modal can handle it
    }
  }

  // Render create modal separately - always available
  const CreateModal = () => (
    <EditTimelineModal
      isOpen={isCreateModalOpen}
      onClose={handleCreateModalClose}
      timeline={null}
      onSave={handleCreateSave}
      isSaving={addMutation.isPending}
    />
  )

  // Show create message if available, otherwise show edit message
  const displayMessage = createMessage || message

  return (
    <>
      <GenericEditView
        dataQuery={dataQuery}
        cardClass="artemis-card"
        itemColorScheme="slate"
        filterLabel="Filter by Timeline Name"
        filterPlaceholder="Search by timeline name (e.g., first-jewish-war, macrinus)..."
        filterFunction={filterFunction}
        renderListItem={renderListItem}
        selectedItemId={selectedItemId}
        onItemSelect={handleItemSelect}
        renderModal={renderModal}
        addNewConfig={{
          label: "Add New Timeline",
          onClick: handleCreateModalOpen,
        }}
        emptyStateConfig={{
          title: "No Timelines Found",
          description:
            "No historical timelines are available. Add some timelines first!",
          showAddButton: true,
        }}
        message={displayMessage}
        onSuccess={handleSuccess}
      />
      <CreateModal />
    </>
  )
}
