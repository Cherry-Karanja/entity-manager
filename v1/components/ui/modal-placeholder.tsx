"use client"

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ModalPlaceholderProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
}

export function ModalPlaceholder({
  isOpen,
  onClose,
  title = "Feature Coming Soon",
  description = "This modal is not yet implemented."
}: ModalPlaceholderProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}