import { useEffect } from 'react'
import type { ReactNode } from 'react'
import styled, { keyframes } from 'styled-components'
import CloseIcon from '@mui/icons-material/Close'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.color.overlay};
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 5rem 1.5rem 3rem;
  overflow-y: auto;
  z-index: 1000;
  animation: ${fadeIn} 150ms ease;
`

const Panel = styled.div<{ $width: string }>`
  position: relative;
  width: 100%;
  max-width: ${({ $width }) => $width};
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  animation: ${slideUp} 200ms cubic-bezier(0.16, 1, 0.3, 1);
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 1.5rem 0;
`

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const Title = styled.h2`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: 650;
`

const Description = styled.p`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
`

const CloseButton = styled.button`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: transparent;
  color: ${({ theme }) => theme.color.textMuted};
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.color.sunken};
    color: ${({ theme }) => theme.color.text};
  }
`

const Body = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
`

type ModalProps = {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  width?: string
}

export default function Modal({
  title,
  description,
  onClose,
  children,
  width = '480px',
}: ModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <Overlay onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <Panel
        $width={width}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <Header>
          <Heading>
            <Title>{title}</Title>
            {description && <Description>{description}</Description>}
          </Heading>
          <CloseButton
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon fontSize="small" />
          </CloseButton>
        </Header>
        <Body>{children}</Body>
      </Panel>
    </Overlay>
  )
}

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.color.border};
`
