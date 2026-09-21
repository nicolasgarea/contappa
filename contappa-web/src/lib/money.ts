const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

const compact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const money = (value: number | null | undefined) => formatter.format(value ?? 0)

export const moneyRounded = (value: number) => compact.format(value)
