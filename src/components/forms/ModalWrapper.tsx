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
      className="z-modal bg-opacity-50 fixed top-0 right-0 bottom-0 left-0 flex h-screen w-screen items-center justify-center bg-black p-0 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`somnus-card h-full w-full overflow-y-auto sm:h-auto sm:max-h-[90vh] sm:max-w-2xl ${className}`}
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
