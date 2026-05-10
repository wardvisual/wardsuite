export function ok<T>(data: T, message = 'Success', meta?: Record<string, unknown>) {
  return { success: true, message, data, ...(meta ? { meta } : {}) };
}

export function fail(message: string, code?: number) {
  return { success: false, message, ...(code ? { code } : {}) };
}
