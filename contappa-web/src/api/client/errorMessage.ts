import { isAxiosError } from 'axios'

export const errorMessage = (error: unknown, fallback = 'Something went wrong. Try again.') => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string' && message.length > 0) return message
  }
  return fallback
}
