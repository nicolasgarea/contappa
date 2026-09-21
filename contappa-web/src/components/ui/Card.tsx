import styled, { css } from 'styled-components'

type CardProps = {
  $interactive?: boolean
  $padded?: boolean
}

const Card = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ $padded = true }) => ($padded ? '1.25rem' : '0')};
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  ${({ $interactive }) =>
    $interactive &&
    css`
      cursor: pointer;

      &:hover {
        border-color: ${({ theme }) => theme.color.borderStrong};
        box-shadow: ${({ theme }) => theme.shadow.md};
      }
    `}
`

export const SectionLabel = styled.h2`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.color.text};
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`

export default Card
