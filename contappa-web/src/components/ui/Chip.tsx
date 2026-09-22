import styled from 'styled-components'
import type { ReactNode } from 'react'

const ChipButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.125rem;
  border: none;
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.color.text : 'transparent')};
  background: none;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ theme, $active }) => ($active ? theme.color.text : theme.color.textMuted)};
  white-space: nowrap;
  transition:
    color ${({ theme }) => theme.transition.fast},
    border-color ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }
`

const Count = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.color.textSubtle};
  font-variant-numeric: tabular-nums;
`

export const ChipRow = styled.div`
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

type ChipProps = {
  active: boolean
  count?: number
  onClick: () => void
  children: ReactNode
}

export default function Chip({ active, count, onClick, children }: ChipProps) {
  return (
    <ChipButton
      type="button"
      $active={active}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
      {count !== undefined && <Count>{count}</Count>}
    </ChipButton>
  )
}
