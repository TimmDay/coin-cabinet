"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAddDevice, useUpdateDevice } from "~/api/devices"
import { FormActions } from "~/components/forms/FormActions"
import { FormErrorDisplay } from "~/components/forms/FormErrorDisplay"
import { ModalWrapper } from "~/components/forms/ModalWrapper"
import { handleUnsavedChanges } from "~/components/forms/formUtils"
import type { Device } from "~/database/schema-devices"
import { useFormPersistence } from "~/hooks/useFormPersistence"
import { arrayToString } from "~/lib/types/form-patterns"
import {
  deviceFormInputSchema,
  deviceFormSchema,
  type DeviceFormInputData,
} from "~/lib/validations/device-form"

type EditDeviceModalProps = {
  device: Device | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: (message: string) => void
  isSaving?: boolean
  mode?: "create" | "edit"
}

const createFormData = (device: Device | null): DeviceFormInputData => ({
  name: device?.name ?? "",
  translation: device?.translation ?? "",
  description: device?.description ?? "",
  category: device?.category ?? "",
  sources: arrayToString(device?.sources),
  artifact_ids: arrayToString(device?.artifact_ids),
  img: device?.img ?? "",
})

export function EditDeviceModal({
  device,
  isOpen,
  onClose,
  onSuccess,
  isSaving = false,
  mode = "edit",
}: EditDeviceModalProps) {
  const isCreateMode = mode === "create"

  const form = useForm<DeviceFormInputData>({
    resolver: zodResolver(deviceFormInputSchema),
    defaultValues: createFormData(null),
  })

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    setError,
    clearErrors,
    reset,
  } = form

  const { clearSavedData } = useFormPersistence({
    key: isCreateMode ? "create-device" : `edit-device-${device?.id}`,
    form,
    enabled: isOpen,
  })

  useEffect(() => {
    if (!isCreateMode && device) {
      reset(createFormData(device))
    }
  }, [device, isCreateMode, reset])

  useEffect(() => {
    if (isCreateMode && isOpen && typeof window !== "undefined") {
      const savedData = localStorage.getItem("form_create-device")
      if (!savedData) {
        reset(createFormData(null))
      }
    }
  }, [isCreateMode, isOpen, reset])

  const addDeviceMutation = useAddDevice()
  const updateDeviceMutation = useUpdateDevice()

  const onSubmit = async (data: DeviceFormInputData) => {
    if (!isCreateMode && !device) return
    clearErrors()

    try {
      const deviceData = deviceFormSchema.parse(data)

      if (isCreateMode) {
        await addDeviceMutation.mutateAsync(deviceData)
        onSuccess?.("✅ Device created successfully")
      } else {
        await updateDeviceMutation.mutateAsync({
          id: device!.id,
          updates: deviceData,
        })
        onSuccess?.("✅ Device updated successfully")
      }
      clearSavedData()
      onClose()
    } catch (error) {
      console.error("Failed to save device:", error)
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save changes. Please try again.",
      })
    }
  }

  const handleClose = () => {
    const closeWithCleanup = () => {
      if (isCreateMode) clearSavedData()
      onClose()
    }
    handleUnsavedChanges(isDirty, closeWithCleanup)
  }

  if (!isOpen || (!isCreateMode && !device)) return null

  const modalTitle = isCreateMode
    ? "Add New Device"
    : `Edit Device: ${device?.name ?? "Unknown"}`

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleClose} title={modalTitle}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
        <FormErrorDisplay errors={errors} />

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Name *
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="e.g. Ballista, Onager, Carroballista"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Translation */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Translation / Alternative Name
          </label>
          <input
            type="text"
            {...register("translation")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="e.g. Stone-thrower, Wild donkey"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Category
          </label>
          <input
            type="text"
            {...register("category")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="e.g. siege engine, hand weapon, naval"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Description *
          </label>
          <textarea
            {...register("description")}
            rows={5}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="Historical context, function, construction, and significance..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Sources */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Sources
          </label>
          <input
            type="text"
            {...register("sources")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="Livy 4.29, Vegetius De Re Militari (comma separated)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate multiple sources with commas
          </p>
        </div>

        {/* Artifact IDs */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Artifact IDs
          </label>
          <input
            type="text"
            {...register("artifact_ids")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="UUID, UUID (comma separated)"
          />
          <p className="mt-1 text-xs text-gray-500">
            UUIDs of related artifacts, separated by commas
          </p>
        </div>

        {/* Image */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Image
          </label>
          <input
            type="text"
            {...register("img")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-900 focus:ring-1 focus:ring-purple-900 focus:outline-none"
            placeholder="Image URL or ID"
          />
        </div>

        <FormActions
          onCancel={handleClose}
          isDirty={isDirty}
          isSaving={isSaving}
        />
      </form>
    </ModalWrapper>
  )
}
