import type { ReactNode } from 'react'
import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const shimmer = keyframes`
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
`

export const Spinner = styled.div<{ $size?: number }>`
  width: ${({ $size = 20 }) => `${$size}px`};
  height: ${({ $size = 20 }) => `${$size}px`};
  border: 2px solid ${({ theme }) => theme.color.border};
  border-top-color: ${({ theme }) => theme.color.accent[500]};
  border-radius: 50%;
  animation: ${spin} 700ms linear infinite;
`

export const Skeleton = styled.div<{ $height?: string; $width?: string; $radius?: string }>`
  height: ${({ $height = '1rem' }) => $height};
  width: ${({ $width = '100%' }) => $width};
  border-radius: ${({ $radius, theme }) => $radius ?? theme.radius.sm};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.color.sunken} 0%,
    ${({ theme }) => theme.color.surfaceAlt} 50%,
    ${({ theme }) => theme.color.sunken} 100%
  );
  background-size: 500px 100%;
  animation: ${shimmer} 1.4s linear infinite;
`

const CenteredState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
  padding: 4.5rem 1.5rem;
  text-align: center;
  border: 1px dashed ${({ theme }) => theme.color.borderStrong};
  border-radius: ${({ theme }) => theme.radius.lg};
`

const IconCircle = styled.div<{ $tone: 'accent' | 'danger' }>`
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background-color: ${({ theme, $tone }) =>
    $tone === 'danger' ? theme.color.danger.soft : theme.color.accent.soft};
  border: 1px solid
    ${({ theme, $tone }) =>
      $tone === 'danger' ? theme.color.danger.line : theme.color.accent.line};
  color: ${({ theme, $tone }) =>
    $tone === 'danger' ? theme.color.danger.base : theme.color.accent[600]};

  svg {
    font-size: 1.75rem;
  }
`

const StateTitle = styled.h3`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: 650;
`

const StateText = styled.p`
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.color.textMuted};
  max-width: 38ch;
`

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  tone?: 'accent' | 'danger'
}

export function EmptyState({ icon, title, description, action, tone = 'accent' }: EmptyStateProps) {
  return (
    <CenteredState>
      {icon && <IconCircle $tone={tone}>{icon}</IconCircle>}
      <StateTitle>{title}</StateTitle>
      {description && <StateText>{description}</StateText>}
      {action}
    </CenteredState>
  )
}

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <CenteredState>
      <Spinner $size={28} />
      <StateText>{label}</StateText>
    </CenteredState>
  )
}
