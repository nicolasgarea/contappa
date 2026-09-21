import type { Table } from '@api/__generated__'

export type Urgency = 'calm' | 'watch' | 'overdue'

export type FloorTable = {
  id: string
  name: string
  number: number
  capacity: number
  guests: number
  amount: number
  seated: boolean
  seatedMinutes: number | null
  lastOrderMinutes: number | null
  urgency: Urgency
  items: { name: string; quantity: number; total: number }[]
}

const WATCH_MINUTES = 60
const OVERDUE_MINUTES = 90

export const urgencyOf = (minutes: number | null): Urgency => {
  if (minutes === null) return 'calm'
  if (minutes >= OVERDUE_MINUTES) return 'overdue'
  if (minutes >= WATCH_MINUTES) return 'watch'
  return 'calm'
}

export const formatElapsed = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`
}

const minutesSince = (
  stamps: (string | null | undefined)[],
  now: number,
  pick: 'oldest' | 'newest',
) => {
  const times = stamps
    .map((value) => (value ? new Date(value).getTime() : null))
    .filter((value): value is number => value !== null)

  if (times.length === 0) return null
  const reference = pick === 'oldest' ? Math.min(...times) : Math.max(...times)
  return Math.max(0, Math.round((now - reference) / 60000))
}

export const toFloorTable = (table: Table, now: number): FloorTable => {
  const bills = table.activeBills ?? []
  const items = new Map<string, { quantity: number; total: number }>()

  bills.forEach((bill) => {
    bill.products?.forEach((line) => {
      const name = line.name ?? 'Unknown product'
      const current = items.get(name) ?? { quantity: 0, total: 0 }
      const quantity = line.quantity ?? 0
      items.set(name, {
        quantity: current.quantity + quantity,
        total: current.total + quantity * (line.unitPrice ?? 0),
      })
    })
  })

  const seatedMinutes = minutesSince(
    bills.map((bill) => bill.openedAt),
    now,
    'oldest',
  )

  return {
    id: table.id!,
    name: table.name || `Table ${table.number}`,
    number: table.number ?? 0,
    capacity: table.capacity ?? 4,
    guests: bills.reduce((sum, bill) => sum + (bill.guests ?? 0), 0),
    amount: bills.reduce((sum, bill) => sum + (bill.amount ?? 0), 0),
    seated: bills.length > 0,
    seatedMinutes,
    lastOrderMinutes: minutesSince(
      bills.map((bill) => bill.lastOrderAt),
      now,
      'newest',
    ),
    urgency: bills.length > 0 ? urgencyOf(seatedMinutes) : 'calm',
    items: [...items.entries()].map(([name, value]) => ({ name, ...value })),
  }
}
