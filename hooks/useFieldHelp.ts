"use client"

import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { api } from "@/utils/api"

interface FieldHelpData {
  [fieldName: string]: {
    help_text?: string
    label?: string
    required?: boolean
    type?: string
  }
}

interface UseFieldHelpReturn {
  fieldHelp: FieldHelpData
  isLoading: boolean
  error: string | null
}

/**
 * Hook to fetch field help text from API OPTIONS endpoint
 * @param endpoint - API endpoint to fetch help text from
 * @returns Object containing field help data, loading state, and error
 */
export function useFieldHelp(endpoint?: string): UseFieldHelpReturn {
  const { data: fieldHelp = {}, isLoading, error } = useQuery<FieldHelpData, AxiosError>({
    queryKey: ['fieldHelp', endpoint],
    queryFn: async () => {
      if (!endpoint) return {}

      // Make OPTIONS request to get field information
      const response = await api.request({
        url: endpoint,
        method: 'OPTIONS'
      })

      const options = response.data

      // Extract field information from OPTIONS response
      const helpData: FieldHelpData = {}

      if (options.actions?.POST) {
        // DRF OPTIONS format
        Object.entries(options.actions.POST).forEach(([fieldName, fieldInfo]: [string, any]) => {
          helpData[fieldName] = {
            help_text: fieldInfo.help_text,
            label: fieldInfo.label,
            required: fieldInfo.required,
            type: fieldInfo.type
          }
        })
      }

      return helpData
    },
    enabled: !!endpoint,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  return { 
    fieldHelp, 
    isLoading, 
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch field help') : null 
  }
}

/**
 * Hook to get help text for a specific field
 * @param fieldName - Name of the field
 * @param endpoint - API endpoint to fetch help from
 * @returns Help text for the field
 */
export function useFieldHelpText(fieldName: string, endpoint?: string): string | undefined {
  const { fieldHelp } = useFieldHelp(endpoint)
  return fieldHelp[fieldName]?.help_text
}

/**
 * Hook to get field metadata (label, required, etc.)
 * @param fieldName - Name of the field
 * @param endpoint - API endpoint to fetch help from
 * @returns Field metadata
 */
export function useFieldMeta(fieldName: string, endpoint?: string) {
  const { fieldHelp } = useFieldHelp(endpoint)
  return fieldHelp[fieldName]
}