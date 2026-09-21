import styled, { css } from 'styled-components'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'ink'
export type ButtonSize = 'sm' | 'md' | 'lg'

type StyledProps = {
  $variant: ButtonVariant
  $size: ButtonSize
  $fullWidth: boolean
}

const sizes = {
  sm: css`
    padding: 0.375rem 0.75rem;
    font-size: ${({ theme }) => theme.font.size.sm};
    border-radius: ${({ theme }) => theme.radius.sm};
    gap: 0.375rem;
  `,
  md: css`
    padding: 0.5625rem 1rem;
    font-size: ${({ theme }) => theme.font.size.base};
    border-radius: ${({ theme }) => theme.radius.md};
    gap: 0.5rem;
  `,
  lg: css`
    padding: 0.75rem 1.25rem;
    font-size: ${({ theme }) => theme.font.size.md};
    border-radius: ${({ theme }) => theme.radius.md};
    gap: 0.5rem;
  `,
}

const solid = (bg: string, ink: string, hover: string) => css`
  background-color: ${bg};
  color: ${ink};
  border-color: ${bg};

  &:hover:not(:disabled) {
    background-color: ${hover};
    border-color: ${hover};
  }
`

const variants = {
  primary: css`
    ${({ theme }) =>
      solid(theme.color.accent[500], theme.color.accent.ink, theme.color.accent[600])}
  `,
  success: css`
    ${({ theme }) =>
      solid(theme.color.success.base, theme.color.success.ink, theme.color.success.hover)}
  `,
  ink: css`
    ${({ theme }) => solid(theme.color.ink, theme.color.inkText, theme.color.inkHover)}
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.color.surface};
    color: ${({ theme }) => theme.color.text};
    border-color: ${({ theme }) => theme.color.border};
    box-shadow: ${({ theme }) => theme.shadow.xs};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.color.surfaceAlt};
      border-color: ${({ theme }) => theme.color.borderStrong};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${({ theme }) => theme.color.textMuted};
    border-color: transparent;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.color.sunken};
      color: ${({ theme }) => theme.color.text};
    }
  `,
  danger: css`
    background-color: ${({ theme }) => theme.color.danger.soft};
    color: ${({ theme }) => theme.color.danger.base};
    border-color: ${({ theme }) => theme.color.danger.line};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.color.danger.base};
      color: ${({ theme }) => theme.color.danger.ink};
      border-color: ${({ theme }) => theme.color.danger.base};
    }
  `,
}

const StyledButton = styled.button<StyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  transition:
    background-color ${({ theme }) => theme.transition.fast},
    border-color ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $size }) => sizes[$size]}
  ${({ $variant }) => variants[$variant]}

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    font-size: 1.15em;
  }
`

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  icon?: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      type={type}
      {...rest}
    >
      {icon}
      {children}
    </StyledButton>
  )
}
