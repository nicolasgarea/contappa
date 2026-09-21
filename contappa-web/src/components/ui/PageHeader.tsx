import type { ReactNode } from 'react'
import styled from 'styled-components'

const Wrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
`

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
`

const Title = styled.h1`
  font-size: clamp(1.5rem, 4vw, 1.875rem);
  font-weight: 700;
`

const Subtitle = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.textMuted};
  font-variant-numeric: tabular-nums;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    width: 100%;

    > * {
      flex: 1 1 auto;
    }
  }
`

type PageHeaderProps = {
  title: string
  subtitle?: ReactNode
  actions?: ReactNode
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Wrapper>
      <Heading>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Heading>
      {actions && <Actions>{actions}</Actions>}
    </Wrapper>
  )
}
