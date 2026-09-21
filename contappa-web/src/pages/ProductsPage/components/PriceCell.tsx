import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { money } from '@lib/money'

type PriceCellProps = {
  price: number
  isSaving: boolean
  onSave: (price: number) => void
}

const Display = styled.button`
  padding: 0.3125rem 0.5rem;
  margin: -0.3125rem -0.5rem;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: none;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  cursor: text;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    border-color: ${({ theme }) => theme.color.borderStrong};
    background-color: ${({ theme }) => theme.color.surface};
  }
`

const Editor = styled.input`
  width: 6rem;
  padding: 0.3125rem 0.5rem;
  margin: -0.3125rem -0.5rem;
  text-align: right;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  border: 1px solid ${({ theme }) => theme.color.accent[500]};
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
  box-shadow: ${({ theme }) => theme.shadow.focus};
  outline: none;
`

export default function PriceCell({ price, isSaving, onSave }: PriceCellProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(price))
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) input.current?.select()
  }, [editing])

  const commit = () => {
    const next = Number(draft)
    setEditing(false)
    if (Number.isFinite(next) && next >= 0 && next !== price) onSave(Math.round(next * 100) / 100)
  }

  if (!editing) {
    return (
      <Display
        type="button"
        title="Click to edit the price"
        disabled={isSaving}
        onClick={(event) => {
          event.stopPropagation()
          setDraft(String(price))
          setEditing(true)
        }}
      >
        {money(price)}
      </Display>
    )
  }

  return (
    <Editor
      ref={input}
      type="number"
      step="0.01"
      min={0}
      value={draft}
      aria-label="Price"
      onClick={(event) => event.stopPropagation()}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') commit()
        if (event.key === 'Escape') setEditing(false)
      }}
    />
  )
}
