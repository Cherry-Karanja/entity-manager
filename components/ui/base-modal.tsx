"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children?: React.ReactNode
}

export function BaseModal({ isOpen, onClose, title, children }: BaseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}