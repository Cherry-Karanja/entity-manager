export const transformData = (
  data: Record<string, unknown>,
  transformer?: (data: Record<string, unknown>) => Record<string, unknown>
): Record<string, unknown> => {
  if (!transformer) return data
  return transformer(data)
}

export const transformFieldValue = (
  value: unknown,
  transform?: (value: unknown) => unknown
): unknown => {
  if (!transform) return value
  return transform(value)
}

export const formatFieldValue = (
  value: unknown,
  format?: (value: unknown) => string
): string => {
  if (!format) return String(value ?? '')
  return format(value)
}

export const parseFieldValue = (
  value: string,
  parse?: (value: string) => unknown
): unknown => {
  if (!parse) return value
  return parse(value)
}