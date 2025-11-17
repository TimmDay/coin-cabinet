"use client"

import { useEffect, useState } from "react"
import {
  useAllSomnusCoins,
  useUpdateSomnusCoin,
} from "~/lib/api/somnus-collection"
import type { SomnusCollection } from "~/server/db/schema"

type EditableItem = SomnusCollection & {
  isEditing: boolean
  hasChanges: boolean
  devicesRaw?: string // Raw string input for devices field while editing
}

export function EditSomnusView() {
  const [items, setItems] = useState<EditableItem[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState<number | null>(null)
  const [nicknameFilter, setNicknameFilter] = useState("")

  const { data: somnusData, isLoading: loading, error } = useAllSomnusCoins()
  const updateCoinMutation = useUpdateSomnusCoin()

  // Transform data when it loads
  useEffect(() => {
    if (somnusData) {
      setItems(
        somnusData.map((item) => ({
          ...item,
          isEditing: false,
          hasChanges: false,
          devicesRaw: item.devices?.join(", ") ?? "",
        })),
      )
    }
  }, [somnusData])

  // Handle errors
  useEffect(() => {
    if (error) {
      setMessage("❌ Failed to load Somnus collection")
    }
  }, [error])

  const handleEdit = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isEditing: true }
          : { ...item, isEditing: false },
      ),
    )
  }

  const handleCancel = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isEditing: false, hasChanges: false }
          : item,
      ),
    )
  }

  const handleFieldChange = (
    id: number,
    field: keyof SomnusCollection,
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value, hasChanges: true } : item,
      ),
    )
  }

  const handleDevicesFieldChange = (id: number, value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, devicesRaw: value, hasChanges: true }
          : item,
      ),
    )
  }

  const processDevicesString = (devicesString: string): string[] | null => {
    if (!devicesString.trim()) return null

    const devicesArray = devicesString
      .split(",")
      .map((device) => device.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean)

    return devicesArray.length > 0 ? devicesArray : null
  }

  const handleSave = async (id: number) => {
    const item = items.find((i) => i.id === id)
    if (!item?.hasChanges) return

    setSaving(id)

    try {
      const updateData = {
        nickname: item.nickname,
        legend_o: item.legend_o,
        legend_o_expanded: item.legend_o_expanded,
        legend_o_translation: item.legend_o_translation,
        legend_r: item.legend_r,
        legend_r_expanded: item.legend_r_expanded,
        legend_r_translation: item.legend_r_translation,
        flavour_text: item.flavour_text,
        godName: item.godName,
        devices: processDevicesString(item.devicesRaw ?? ""),
      }

      await updateCoinMutation.mutateAsync({
        id: id.toString(),
        data: updateData,
      })

      const processedDevices = processDevicesString(item.devicesRaw ?? "")
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                isEditing: false,
                hasChanges: false,
                devices: processedDevices,
                devicesRaw: processedDevices?.join(", ") ?? "",
              }
            : i,
        ),
      )
      setMessage("✅ Item updated successfully")
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Error saving:", error)
      setMessage("❌ Failed to save changes")
    } finally {
      setSaving(null)
    }
  }

  // Filter items based on nickname and devices
  const filteredItems = items.filter((item) => {
    if (!nicknameFilter.trim()) return true

    const searchTerm = nicknameFilter.toLowerCase()

    // Check nickname
    const nicknameMatch =
      item.nickname?.toLowerCase().includes(searchTerm) ?? false

    // Check devices array
    const devicesMatch =
      item.devices?.some((device) =>
        device.toLowerCase().includes(searchTerm),
      ) ?? false

    return nicknameMatch || devicesMatch
  })

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p className="coin-description text-lg">Loading Somnus collection...</p>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="artemis-card p-8 text-center">
        <h3 className="coin-title mb-4 text-xl">No Items Found</h3>
        <p className="coin-description">Your Somnus collection is empty.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className="artemis-card p-4 text-center">
          <p className="text-lg font-medium">{message}</p>
        </div>
      )}

      {/* Filter Input */}
      <div className="artemis-card p-4">
        <label
          htmlFor="nickname-filter"
          className="mb-2 block text-sm font-medium"
        >
          Filter by Nickname or Devices
        </label>
        <input
          id="nickname-filter"
          type="text"
          value={nicknameFilter}
          onChange={(e) => setNicknameFilter(e.target.value)}
          placeholder="Search by nickname or device (e.g., victoria, mars)..."
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 focus:outline-none"
        />
        {nicknameFilter && (
          <p className="mt-2 text-sm text-gray-600">
            Showing {filteredItems.length} of {items.length} items
          </p>
        )}
      </div>

      {filteredItems.length === 0 && nicknameFilter ? (
        <div className="artemis-card p-8 text-center">
          <h3 className="coin-title mb-4 text-xl">No Matching Items</h3>
          <p className="coin-description">
            No items found matching &ldquo;{nicknameFilter}&rdquo;
          </p>
        </div>
      ) : (
        <div className="artemis-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1870px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="sticky left-0 z-10 min-w-[120px] border-r border-gray-200 bg-slate-800 p-3 text-left font-semibold">
                    Nickname
                  </th>
                  <th className="min-w-[120px] p-3 text-left font-semibold">
                    Legend O
                  </th>
                  <th className="min-w-[180px] p-3 text-left font-semibold">
                    Legend O Expanded
                  </th>
                  <th className="min-w-[160px] p-3 text-left font-semibold">
                    Legend O Translation
                  </th>
                  <th className="min-w-[120px] p-3 text-left font-semibold">
                    Legend R
                  </th>
                  <th className="min-w-[180px] p-3 text-left font-semibold">
                    Legend R Expanded
                  </th>
                  <th className="min-w-[160px] p-3 text-left font-semibold">
                    Legend R Translation
                  </th>
                  <th className="min-w-[150px] p-3 text-left font-semibold">
                    Flavour Text
                  </th>
                  <th className="min-w-[120px] p-3 text-left font-semibold">
                    God
                  </th>
                  <th className="min-w-[150px] p-3 text-left font-semibold">
                    Devices
                  </th>
                  <th className="sticky right-0 z-10 min-w-[120px] border-l border-gray-200 bg-slate-800 p-3 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={
                      `border-b border-gray-100 ` +
                      (item.isEditing
                        ? "bg-gray-700 text-white" // dark grey for editing row
                        : "hover:bg-gray-600 hover:text-white") // dark grey for hover
                    }
                  >
                    <td
                      className={`sticky left-0 z-10 border-r border-gray-200 p-3 ${
                        item.isEditing
                          ? "bg-gray-700 text-white" // match editing row color and text
                          : "bg-slate-800 hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      {item.isEditing ? (
                        <input
                          type="text"
                          value={item.nickname ?? ""}
                          onChange={(e) =>
                            handleFieldChange(
                              item.id,
                              "nickname",
                              e.target.value,
                            )
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          placeholder="Nickname"
                        />
                      ) : (
                        <span className="text-sm">{item.nickname ?? "—"}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {item.isEditing ? (
                        <input
                          type="text"
                          value={item.legend_o ?? ""}
                          onChange={(e) =>
                            handleFieldChange(
                              item.id,
                              "legend_o",
                              e.target.value,
                            )
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          placeholder="Legend O"
                        />
                      ) : (
                        <span className="text-sm">{item.legend_o ?? "—"}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {item.isEditing ? (
                        <textarea
                          value={item.legend_o_expanded ?? ""}
                          onChange={(e) =>
                            handleFieldChange(
                              item.id,
                              "legend_o_expanded",
                              e.target.value,
                            )
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          placeholder="Legend O Expanded"
                          rows={2}
                        />
                      ) : (
                        <span className="text-sm">
                          {item.legend_o_expanded ?? "—"}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {item.isEditing ? (
                        <textarea
                          value={item.legend_o_translation ?? ""}
                          onChange={(e) =>
                            handleFieldChange(
                              item.id,
                              "legend_o_translation",
                              e.target.value,
                            )
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          placeholder="Legend O Translation"
                          rows={2}
                        />
                      ) : (
                        <span className="text-sm">
                          {item.legend_o_translation ?? "—"}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {item.isEditing ? (
                        <input
                          type="text"
                          value={item.legend_r ?? ""}
                          onChange={(e) =>
                            handleFieldChange(
                              item.id,
                              "legend_r",
                              e.target.value,
                            )
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          placeholder="Legend R"
                        />
                      ) : (
                        <span className="text-sm">{item.legend_r ?? "—"}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {item.isEditing ? (
                        <textarea
                          value={item.legend_r_expanded ?? ""}
                          onChange={(e) =>
                            handleFieldChange(
                              item.id,
                              "legend_r_expanded",
                              e.target.value,
                            )
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          placeholder="Legend R Expanded"
                          rows={2}
                        />
                      ) : (
                        <span className="text-sm">
                          {item.legend_r_expanded ?? "—"}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {item.isEditing ? (
                        <textarea
                          value={item.legend_r_translation ?? ""}
                          onChange={(e) =>
                            handleFieldChange(
                              item.id,
                              "legend_r_translation",
                              e.target.value,
                            )
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          placeholder="Legend R Translation"
                          rows={2}
                        />
                      ) : (
                        <span className="text-sm">
                          {item.legend_r_translation ?? "—"}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {item.isEditing ? (
                        <textarea
                          value={item.flavour_text ?? ""}
                          onChange={(e) =>
                            handleFieldChange(
                              item.id,
                              "flavour_text",
                              e.target.value,
                            )
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          placeholder="Flavour Text"
                          rows={2}
                        />
                      ) : (
                        <span className="text-sm">
                          {item.flavour_text ?? "—"}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {item.isEditing ? (
                        <input
                          type="text"
                          value={item.godName ?? ""}
                          onChange={(e) =>
                            handleFieldChange(
                              item.id,
                              "godName",
                              e.target.value,
                            )
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          placeholder="e.g., Jupiter, Mars, Diana"
                        />
                      ) : (
                        <span className="text-sm">{item.godName ?? "—"}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {item.isEditing ? (
                        <input
                          type="text"
                          value={item.devicesRaw}
                          onChange={(e) =>
                            handleDevicesFieldChange(item.id, e.target.value)
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          placeholder="e.g., concordia, victoria, mars"
                        />
                      ) : (
                        <span className="text-sm">
                          {item.devices?.length ? item.devices.join(", ") : "—"}
                        </span>
                      )}
                    </td>
                    <td
                      className={`sticky right-0 z-10 border-l border-gray-200 p-3 ${
                        item.isEditing
                          ? "bg-gray-700 text-white" // match editing row color and text
                          : "bg-slate-800 hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <div className="flex justify-center gap-2">
                        {item.isEditing ? (
                          <>
                            <button
                              onClick={() => handleSave(item.id)}
                              disabled={!item.hasChanges || saving === item.id}
                              className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {saving === item.id ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => handleCancel(item.id)}
                              disabled={saving === item.id}
                              className="rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
