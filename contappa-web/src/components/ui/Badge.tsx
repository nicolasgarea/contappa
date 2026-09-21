import styled from 'styled-components'

export type BadgeTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info' | 'accent'

const Badge = styled.span<{ $tone?: BadgeTone; $dot?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.1875rem 0.5rem;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: 650;
  letter-spacing: 0.02em;
  border: 1px solid;
  white-space: nowrap;

  ${({ theme, $tone = 'neutral' }) => {
    const tones = {
      neutral: { bg: theme.color.sunken, line: theme.color.border, fg: theme.color.textMuted },
      success: {
        bg: theme.color.success.soft,
        line: theme.color.success.line,
        fg: theme.color.success.base,
      },
      danger: {
        bg: theme.color.danger.soft,
        line: theme.color.danger.line,
        fg: theme.color.danger.base,
      },
      warning: {
        bg: theme.color.warning.soft,
        line: theme.color.warning.line,
        fg: theme.color.warning.base,
      },
      info: { bg: theme.color.info.soft, line: theme.color.info.line, fg: theme.color.info.base },
      accent: {
        bg: theme.color.accent.soft,
        line: theme.color.accent.line,
        fg: theme.color.accent[600],
      },
    }
    const tone = tones[$tone]
    return `background-color: ${tone.bg}; border-color: ${tone.line}; color: ${tone.fg};`
  }}

  &::before {
    content: ${({ $dot }) => ($dot ? "''" : 'none')};
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: currentColor;
  }
`

export default Badge
