"use client"

import { useCallback } from "react"

// Minimal permissions hook: adapt to your auth system as needed
export const usePermissions = () => {
  // hasPermission accepts a permission string and returns boolean.
  const hasPermission = useCallback((permission?: string | undefined) => {
    if (!permission) return true
    // TODO: wire to real permission store / user context. For now, allow everything.
    return true
  }, [])

  return { hasPermission }
}

export default usePermissions