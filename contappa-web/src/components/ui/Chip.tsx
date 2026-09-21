import styled from 'styled-components'
import type { ReactNode } from 'react'

const ChipButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4375rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 600;
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transition.fast};

  background-color: ${({ theme, $active }) => ($active ? theme.color.ink : theme.color.surface)};
  color: ${({ theme, $active }) => ($active ? theme.color.inkText : theme.color.textMuted)};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.color.ink : theme.color.border)};

  &:hover {
    border-color: ${({ theme, $active }) => ($active ? theme.color.ink : theme.color.borderStrong)};
    color: ${({ theme, $active }) => ($active ? theme.color.inkText : theme.color.text)};
  }
`

const Count = styled.span`
  font-variant-numeric: tabular-nums;
  opacity: 0.6;
`

export const ChipRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
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
