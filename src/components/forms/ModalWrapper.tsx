"use client"

import type { ReactNode } from "react"

type ModalWrapperProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function ModalWrapper({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}: ModalWrapperProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="z-modal bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`somnus-card max-h-[90vh] w-full max-w-2xl overflow-y-auto ${className}`}
      >
        <div className="sticky top-0 border-b border-gray-200 bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
