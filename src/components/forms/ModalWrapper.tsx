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
}: ModalWrapperProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="z-modal bg-opacity-50 fixed top-0 right-0 bottom-0 left-0 flex h-screen w-screen items-start justify-center bg-black px-0 pt-6 pb-6 sm:items-center sm:p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`somnus-card flex h-full w-full flex-col overflow-hidden sm:h-auto sm:max-h-[90vh] sm:max-w-2xl`}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-slate-800 px-4 pt-6 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="pb-safe min-h-0 flex-1 overflow-y-auto sm:pb-0">
          {children}
        </div>
      </div>
    </div>
  )
}
