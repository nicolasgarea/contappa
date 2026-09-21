import { useState } from 'react'
import styled from 'styled-components'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Modal, { ModalActions } from '@components/ui/Modal'
import Button from '@components/ui/Button'
import { money } from '@lib/money'
import type { OrderLine } from './OrderPanel'

export type SplitSelection = { productId: string; quantity: number }[]

type SplitBillModalProps = {
  lines: OrderLine[]
  isWorking: boolean
  error?: string | null
  onClose: () => void
  onConfirm: (staying: SplitSelection, moving: SplitSelection) => void
}

const Rows = styled.div`
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

const Name = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;
  font-weight: 600;

  small {
    font-size: ${({ theme }) => theme.font.size.sm};
    font-weight: 400;
    color: ${({ theme }) => theme.color.textMuted};
    font-variant-numeric: tabular-nums;
  }
`

const Stepper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 2px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.pill};
`

const StepButton = styled.button`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  color: ${({ theme }) => theme.color.textMuted};
  transition: all ${({ theme }) => theme.transition.fast};

  svg {
    font-size: 1.0625rem;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.color.accent[500]};
    color: ${({ theme }) => theme.color.accent.ink};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`

const Moved = styled.span`
  min-width: 3.25rem;
  text-align: center;
  font-weight: 700;
  font-variant-numeric: tabular-nums;

  small {
    font-weight: 500;
    color: ${({ theme }) => theme.color.textSubtle};
  }
`

const Totals = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 1.25rem;
`

const TotalCard = styled.div<{ $accent?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.875rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ theme, $accent }) => ($accent ? theme.color.accent.line : theme.color.border)};
  background-color: ${({ theme, $accent }) =>
    $accent ? theme.color.accent.soft : theme.color.surfaceAlt};

  span {
    font-size: ${({ theme }) => theme.font.size.sm};
    color: ${({ theme }) => theme.color.textMuted};
  }

  strong {
    font-size: ${({ theme }) => theme.font.size.xl};
    font-weight: 700;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
`

const ErrorNote = styled.p`
  margin-top: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.color.danger.line};
  background-color: ${({ theme }) => theme.color.danger.soft};
  color: ${({ theme }) => theme.color.danger.base};
  font-size: ${({ theme }) => theme.font.size.sm};
`

export default function SplitBillModal({
  lines,
  isWorking,
  error,
  onClose,
  onConfirm,
}: SplitBillModalProps) {
  const [moving, setMoving] = useState<Record<string, number>>({})

  const movedOf = (productId: string) => moving[productId] ?? 0
  const setMoved = (productId: string, quantity: number) =>
    setMoving((current) => ({ ...current, [productId]: quantity }))

  const movingTotal = lines.reduce((sum, line) => sum + movedOf(line.productId) * line.unitPrice, 0)
  const stayingTotal = lines.reduce(
    (sum, line) => sum + (line.quantity - movedOf(line.productId)) * line.unitPrice,
    0,
  )
  const movedUnits = lines.reduce((sum, line) => sum + movedOf(line.productId), 0)
  const totalUnits = lines.reduce((sum, line) => sum + line.quantity, 0)
  const valid = movedUnits > 0 && movedUnits < totalUnits

  const confirm = () => {
    const staying = lines
      .map((line) => ({
        productId: line.productId,
        quantity: line.quantity - movedOf(line.productId),
      }))
      .filter((line) => line.quantity > 0)
    const leaving = lines
      .map((line) => ({ productId: line.productId, quantity: movedOf(line.productId) }))
      .filter((line) => line.quantity > 0)
    onConfirm(staying, leaving)
  }

  return (
    <Modal
      title="Split bill"
      description="Choose how many of each item move to a new bill. Both bills stay open on this table."
      onClose={onClose}
      width="540px"
    >
      <Rows>
        {lines.map((line) => (
          <Row key={line.productId}>
            <Name>
              {line.name}
              <small>
                {line.quantity} × {money(line.unitPrice)}
              </small>
            </Name>
            <Stepper>
              <StepButton
                type="button"
                aria-label={`Move fewer ${line.name}`}
                disabled={movedOf(line.productId) <= 0}
                onClick={() => setMoved(line.productId, movedOf(line.productId) - 1)}
              >
                <RemoveIcon />
              </StepButton>
              <Moved>
                {movedOf(line.productId)} <small>/ {line.quantity}</small>
              </Moved>
              <StepButton
                type="button"
                aria-label={`Move more ${line.name}`}
                disabled={movedOf(line.productId) >= line.quantity}
                onClick={() => setMoved(line.productId, movedOf(line.productId) + 1)}
              >
                <AddIcon />
              </StepButton>
            </Stepper>
          </Row>
        ))}
      </Rows>

      <Totals>
        <TotalCard>
          <span>Stays on this bill</span>
          <strong>{money(stayingTotal)}</strong>
        </TotalCard>
        <TotalCard $accent>
          <span>Moves to a new bill</span>
          <strong>{money(movingTotal)}</strong>
        </TotalCard>
      </Totals>

      {error && <ErrorNote role="alert">{error}</ErrorNote>}

      <ModalActions>
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={!valid || isWorking}
          onClick={confirm}
        >
          {isWorking ? 'Splitting…' : 'Split bill'}
        </Button>
      </ModalActions>
    </Modal>
  )
}
