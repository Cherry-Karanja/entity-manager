/**
 * Performance Optimization Utilities
 * 
 * This module provides utilities for optimizing React component performance,
 * including debouncing, throttling, memoization helpers, and virtual scrolling utilities.
 */

import { useEffect, useRef, useCallback, useMemo, DependencyList } from 'react'

// ===== DEBOUNCE & THROTTLE =====

/**
 * Debounce function - delays execution until after a specified wait time
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, wait)
  }
}

/**
 * Throttle function - limits execution to once per specified time period
 * @param func Function to throttle
 * @param limit Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return function throttled(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * React hook for debounced callback
 * @param callback Function to debounce
 * @param delay Delay in milliseconds
 * @param deps Dependencies array
 * @returns Debounced callback
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: DependencyList = []
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay, ...deps])
}

/**
 * React hook for throttled callback
 * @param callback Function to throttle
 * @param limit Time limit in milliseconds
 * @param deps Dependencies array
 * @returns Throttled callback
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number,
  deps: DependencyList = []
): (...args: Parameters<T>) => void {
  const inThrottleRef = useRef(false)

  return useCallback((...args: Parameters<T>) => {
    if (!inThrottleRef.current) {
      callback(...args)
      inThrottleRef.current = true
      setTimeout(() => {
        inThrottleRef.current = false
      }, limit)
    }
  }, [callback, limit, ...deps])
}

// ===== MEMOIZATION HELPERS =====

/**
 * Deep comparison for useMemo/useCallback dependencies
 * @param a First value
 * @param b Second value
 * @returns True if values are deeply equal
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a == null || b == null) return false
  if (typeof a !== 'object' || typeof b !== 'object') return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false
    }
  }

  return true
}

/**
 * Shallow comparison for objects
 * @param objA First object
 * @param objB Second object
 * @returns True if objects are shallowly equal
 */
export function shallowEqual(objA: any, objB: any): boolean {
  if (objA === objB) return true
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key) || objA[key] !== objB[key]) {
      return false
    }
  }

  return true
}

// ===== VIRTUAL SCROLLING =====

export interface VirtualScrollConfig {
  itemCount: number
  itemHeight: number | ((index: number) => number)
  containerHeight: number
  overscan?: number
}

export interface VirtualScrollResult {
  virtualItems: Array<{
    index: number
    start: number
    size: number
  }>
  totalSize: number
  scrollOffset: number
}

/**
 * Calculate virtual scroll items to render
 * @param config Virtual scroll configuration
 * @param scrollOffset Current scroll offset
 * @returns Virtual scroll result with items to render
 */
export function calculateVirtualItems(
  config: VirtualScrollConfig,
  scrollOffset: number
): VirtualScrollResult {
  const { itemCount, itemHeight, containerHeight, overscan = 3 } = config

  const isFixedSize = typeof itemHeight === 'number'

  if (isFixedSize) {
    const fixedHeight = itemHeight as number
    const totalSize = itemCount * fixedHeight
    const startIndex = Math.max(0, Math.floor(scrollOffset / fixedHeight) - overscan)
    const endIndex = Math.min(
      itemCount - 1,
      Math.ceil((scrollOffset + containerHeight) / fixedHeight) + overscan
    )

    const virtualItems = []
    for (let i = startIndex; i <= endIndex; i++) {
      virtualItems.push({
        index: i,
        start: i * fixedHeight,
        size: fixedHeight
      })
    }

    return { virtualItems, totalSize, scrollOffset }
  } else {
    // Variable height items
    const getHeight = itemHeight as (index: number) => number
    let totalSize = 0
    const itemOffsets: number[] = []

    for (let i = 0; i < itemCount; i++) {
      itemOffsets.push(totalSize)
      totalSize += getHeight(i)
    }

    const startIndex = Math.max(
      0,
      itemOffsets.findIndex(offset => offset >= scrollOffset) - overscan
    )
    const endIndex = Math.min(
      itemCount - 1,
      itemOffsets.findIndex(offset => offset >= scrollOffset + containerHeight) + overscan
    )

    const virtualItems = []
    for (let i = startIndex; i <= endIndex; i++) {
      virtualItems.push({
        index: i,
        start: itemOffsets[i],
        size: getHeight(i)
      })
    }

    return { virtualItems, totalSize, scrollOffset }
  }
}

/**
 * React hook for virtual scrolling
 * @param config Virtual scroll configuration
 * @returns Virtual scroll utilities
 */
export function useVirtualScroll(config: VirtualScrollConfig) {
  const scrollOffsetRef = useRef(0)

  const virtualItems = useMemo(() => {
    return calculateVirtualItems(config, scrollOffsetRef.current)
  }, [config.itemCount, config.itemHeight, config.containerHeight, config.overscan])

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    scrollOffsetRef.current = event.currentTarget.scrollTop
  }, [])

  return {
    virtualItems: virtualItems.virtualItems,
    totalSize: virtualItems.totalSize,
    handleScroll
  }
}

// ===== LAZY LOADING =====

/**
 * React hook for intersection observer (lazy loading)
 * @param callback Function to call when element is visible
 * @param options Intersection observer options
 * @returns Ref to attach to element
 */
export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback()
        }
      })
    }, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [callback, options])

  return ref
}

// ===== PERFORMANCE MONITORING =====

/**
 * Performance measurement utility
 * @param name Measurement name
 * @param callback Function to measure
 * @returns Function result
 */
export async function measurePerformance<T>(
  name: string,
  callback: () => T | Promise<T>
): Promise<T> {
  const startTime = performance.now()
  const result = await callback()
  const endTime = performance.now()
  const duration = endTime - startTime

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
  }

  return result
}

/**
 * React hook for performance monitoring
 * @param componentName Component name
 * @param props Component props
 */
export function usePerformanceMonitor(componentName: string, props?: any) {
  const renderCountRef = useRef(0)
  const lastRenderTimeRef = useRef(performance.now())

  useEffect(() => {
    renderCountRef.current += 1
    const currentTime = performance.now()
    const renderTime = currentTime - lastRenderTimeRef.current
    lastRenderTimeRef.current = currentTime

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[Render] ${componentName} - Count: ${renderCountRef.current}, Time: ${renderTime.toFixed(2)}ms`,
        props
      )
    }
  })
}

// ===== BATCHING & SCHEDULING =====

/**
 * Batch multiple updates together
 * @param updates Array of update functions
 */
export function batchUpdates(updates: Array<() => void>) {
  // Use requestAnimationFrame for batching
  requestAnimationFrame(() => {
    updates.forEach(update => update())
  })
}

/**
 * Schedule work for idle time
 * @param callback Function to execute during idle time
 * @param options Idle callback options
 */
export function scheduleIdleWork(
  callback: () => void,
  options?: IdleRequestOptions
) {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback, options)
  } else {
    // Fallback for browsers without requestIdleCallback
    return setTimeout(callback, 1) as any
  }
}

/**
 * Cancel scheduled idle work
 * @param handle Handle returned from scheduleIdleWork
 */
export function cancelIdleWork(handle: number) {
  if ('cancelIdleCallback' in window) {
    cancelIdleCallback(handle)
  } else {
    clearTimeout(handle)
  }
}

// ===== CACHE UTILITIES =====

/**
 * Simple LRU cache implementation
 */
export class LRUCache<K, V> {
  private cache = new Map<K, V>()
  private maxSize: number

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined

    const value = this.cache.get(key)
    if (value === undefined) return undefined
    
    // Move to end (most recently used)
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, value)
  }

  has(key: K): boolean {
    return this.cache.has(key)
  }

  clear(): void {
    this.cache.clear()
  }

  get size(): number {
    return this.cache.size
  }
}

/**
 * Memoize function results with LRU cache
 * @param fn Function to memoize
 * @param maxSize Maximum cache size
 * @returns Memoized function
 */
export function memoizeWithCache<T extends (...args: any[]) => any>(
  fn: T,
  maxSize: number = 100
): T {
  const cache = new LRUCache<string, ReturnType<T>>(maxSize)

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}
