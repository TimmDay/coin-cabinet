"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import type { UseQueryResult } from "@tanstack/react-query"
import { RefreshCacheButton } from "./RefreshCacheButton"
import { Button } from "~/components/ui/Button"

export type EditableItem = {
  id: number | string
  updated_at?: string
}

export type GenericEditViewProps<T extends EditableItem> = {
  dataQuery: UseQueryResult<T[]>
  cardClass?: "artemis-card" | "somnus-card"
  itemColorScheme?: "gray" | "slate"
  filterLabel: string
  filterPlaceholder: string
  filterFunction: (item: T, filterTerm: string) => boolean
  renderListItem: (item: T) => ReactNode
  selectedItemId: number | string | null
  onItemSelect: (item: T) => void
  renderModal: (selectedItem: T | null) => ReactNode
  addNewConfig?: {
    label: string
    href?: string
    onClick?: () => void
  }
  emptyStateConfig: {
    title: string
    description: string
    showAddButton?: boolean
  }
  message: string | null
  onSuccess: (message: string) => void
}

export function GenericEditView<T extends EditableItem>({
  dataQuery,
  cardClass = "artemis-card",
  itemColorScheme = "gray",
  filterLabel,
  filterPlaceholder,
  filterFunction,
  renderListItem,
  selectedItemId,
  onItemSelect,
  renderModal,
  addNewConfig,
  emptyStateConfig,
  message,
  onSuccess,
}: GenericEditViewProps<T>) {
  const [filterTerm, setFilterTerm] = useState("")

  const { data: items = [], isLoading: loading, error } = dataQuery

  useEffect(() => {
    if (error) {
      onSuccess("❌ Failed to load data")
    }
  }, [error, onSuccess])

  const filteredItems = items.filter((item) => filterFunction(item, filterTerm))

  const itemColors =
    itemColorScheme === "slate"
      ? {
          bg: "bg-slate-800",
          hoverBg: "hover:bg-gray-600",
          text: "text-white",
          subtext: "text-gray-300",
          muted: "text-gray-400",
          icon: "text-gray-400",
        }
      : {
          bg: "bg-white",
          hoverBg: "hover:bg-gray-50",
          text: "text-gray-900",
          subtext: "text-gray-600",
          muted: "text-gray-500",
          icon: "text-gray-400",
        }

  const selectedItem = selectedItemId
    ? (items.find((item) => item.id === selectedItemId) ?? null)
    : null

  return (
    <div className="space-y-6">
      {message && (
        <div className={`${cardClass} p-4 text-center`}>
          <p className="text-lg font-medium">{message}</p>
        </div>
      )}

      <div className={`${cardClass} p-4`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md flex-1">
            <label
              htmlFor="filter-input"
              className="mb-2 block text-sm font-medium"
            >
              {filterLabel}
            </label>
            <input
              id="filter-input"
              type="text"
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              placeholder={filterPlaceholder}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-900 focus:ring-purple-900 focus:outline-none"
            />
            {filterTerm && (
              <p className="mt-2 text-sm text-gray-600">
                Showing {filteredItems.length} of {items.length} items
              </p>
            )}
          </div>

          {addNewConfig && (
            <>
              {addNewConfig.href ? (
                <Link href={addNewConfig.href}>
                  <Button>{addNewConfig.label}</Button>
                </Link>
              ) : (
                <Button onClick={addNewConfig.onClick}>
                  {addNewConfig.label}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className={`${cardClass} p-8 text-center`}>
          <p className="text-lg">Loading...</p>
        </div>
      ) : filteredItems.length === 0 && filterTerm ? (
        <div className={`${cardClass} p-8 text-center`}>
          <h3 className="coin-title mb-4 text-xl">No Matching Results</h3>
          <p className="coin-description">
            No items found matching &ldquo;{filterTerm}&rdquo;
          </p>
        </div>
      ) : (
        <div className={`${cardClass} p-6`}>
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onItemSelect(item)}
                className={`w-full cursor-pointer rounded-lg border border-gray-200 ${itemColors.bg} p-4 text-left transition-colors ${itemColors.hoverBg} hover:text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">{renderListItem(item)}</div>
                  <div className={itemColors.icon}>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && !filterTerm && (
            <div className="py-8 text-center">
              <h3 className="coin-title mb-4 text-xl">
                {emptyStateConfig.title}
              </h3>
              <p className="coin-description mb-6">
                {emptyStateConfig.description}
              </p>
              {emptyStateConfig.showAddButton && addNewConfig && (
                <>
                  {addNewConfig.href ? (
                    <Link href={addNewConfig.href}>
                      <Button>{addNewConfig.label}</Button>
                    </Link>
                  ) : (
                    <Button onClick={addNewConfig.onClick}>
                      {addNewConfig.label}
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {selectedItem && renderModal(selectedItem)}

      {/* Refresh Cache Button */}
      <div className="mt-8 text-center">
        <RefreshCacheButton
          onMessage={onSuccess}
          className="bg-purple-700 text-white opacity-75 transition-all hover:bg-purple-600 hover:opacity-100"
        />
      </div>
    </div>
  )
}
