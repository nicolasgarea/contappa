import styled from 'styled-components'
import Modal, { ModalActions } from './Modal'
import Button from './Button'

const ErrorNote = styled.p`
  margin-bottom: 1rem;
  padding: 0.625rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.color.danger.line};
  background-color: ${({ theme }) => theme.color.danger.soft};
  color: ${({ theme }) => theme.color.danger.base};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 500;
`

type ConfirmDialogProps = {
  title: string
  description: string
  confirmLabel: string
  isWorking?: boolean
  error?: string | null
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmDialog({
  title,
  description,
  confirmLabel,
  isWorking = false,
  error,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal
      title={title}
      description={description}
      onClose={onClose}
      width="420px"
    >
      {error && <ErrorNote role="alert">{error}</ErrorNote>}
      <ModalActions style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          disabled={isWorking}
          onClick={onConfirm}
        >
          {isWorking ? 'Working…' : confirmLabel}
        </Button>
      </ModalActions>
    </Modal>
  )
}
