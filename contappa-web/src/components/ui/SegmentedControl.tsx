import styled from 'styled-components'

const Track = styled.div`
  display: inline-flex;
  padding: 4px;
  gap: 2px;
  background-color: ${({ theme }) => theme.color.sunken};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.pill};
`

const Segment = styled.button<{ $active: boolean }>`
  padding: 0.375rem 0.9375rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 650;
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transition.fast};

  background-color: ${({ theme, $active }) => ($active ? theme.color.accent[500] : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.color.accent.ink : theme.color.textMuted)};

  &:hover {
    color: ${({ theme, $active }) => ($active ? theme.color.accent.ink : theme.color.text)};
  }
`

type Option = {
  value: string
  label: string
}

type SegmentedControlProps = {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

export default function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <Track role="tablist">
      {options.map((option) => (
        <Segment
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          $active={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Segment>
      ))}
    </Track>
  )
}
