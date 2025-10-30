import { useMemo } from 'react'
import { FormFieldConfig } from '@/types'
import { FieldErrors } from 'react-hook-form'
import {
  generateStylingFactors,
  applyDynamicStyling,
  DynamicStyleConfig,
  StylingFactors,
  predefinedStyles
} from '@/utils/dynamicStyling'

/**
 * Hook for applying dynamic styling to form fields
 */
export function useDynamicStyling(
  field: FormFieldConfig,
  value: unknown,
  errors: FieldErrors,
  customConfig?: Partial<DynamicStyleConfig>,
  interactionState: 'idle' | 'hover' | 'focus' | 'active' = 'idle'
) {
  const factors = useMemo(
    () => generateStylingFactors(field, value, errors, interactionState),
    [field, value, errors, interactionState]
  )

  const getStyles = useMemo(() => {
    return (elementType: keyof typeof predefinedStyles, additionalConfig?: Partial<DynamicStyleConfig>) => {
      const baseConfig = predefinedStyles[elementType]
      const mergedConfig = {
        ...baseConfig,
        ...customConfig,
        ...additionalConfig
      }

      return applyDynamicStyling(mergedConfig as DynamicStyleConfig, factors)
    }
  }, [factors, customConfig])

  return {
    factors,
    getStyles,
    // Convenience methods for common elements
    inputStyles: (additionalConfig?: Partial<DynamicStyleConfig>) =>
      getStyles('container', additionalConfig), // Use container styles for input as fallback
    containerStyles: (additionalConfig?: Partial<DynamicStyleConfig>) =>
      getStyles('container', additionalConfig),
    labelStyles: (additionalConfig?: Partial<DynamicStyleConfig>) =>
      getStyles('label', additionalConfig),
    errorStyles: (additionalConfig?: Partial<DynamicStyleConfig>) =>
      getStyles('error', additionalConfig),
    relationshipStyles: (additionalConfig?: Partial<DynamicStyleConfig>) =>
      getStyles('relationship', additionalConfig)
  }
}

/**
 * Hook for creating custom styling configurations
 */
export function useCustomStyling(baseConfig: DynamicStyleConfig) {
  return useMemo(() => ({
    getStyles: (factors: StylingFactors) => applyDynamicStyling(baseConfig, factors),
    mergeWith: (otherConfig: Partial<DynamicStyleConfig>) => ({
      ...baseConfig,
      ...otherConfig,
      conditionalStyles: [
        ...(baseConfig.conditionalStyles || []),
        ...(otherConfig.conditionalStyles || [])
      ]
    })
  }), [baseConfig])
}

/**
 * Hook for theme-based styling
 */
export function useThemeStyling(theme: 'light' | 'dark' | 'auto' = 'auto') {
  const isDark = useMemo(() => {
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme === 'dark'
  }, [theme])

  const themeStyles = useMemo(() => ({
    container: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#374151' : '#d1d5db',
      color: isDark ? '#f9fafb' : '#111827'
    },
    label: {
      color: isDark ? '#f9fafb' : '#111827'
    },
    input: {
      backgroundColor: isDark ? '#374151' : '#ffffff',
      borderColor: isDark ? '#4b5563' : '#d1d5db',
      color: isDark ? '#f9fafb' : '#111827'
    },
    error: {
      color: '#ef4444'
    },
    relationship: {
      backgroundColor: isDark ? '#111827' : '#f9fafb',
      borderColor: isDark ? '#374151' : '#e5e7eb'
    }
  }), [isDark])

  return useMemo(() => ({
    theme,
    isDark,
    themeStyles
  }), [isDark, theme, themeStyles])
}