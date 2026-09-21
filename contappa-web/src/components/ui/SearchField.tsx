import styled from 'styled-components'
import SearchIcon from '@mui/icons-material/Search'
import Input from './Input'

const Wrap = styled.div<{ $width?: string }>`
  position: relative;
  width: ${({ $width }) => $width ?? '100%'};

  @media (max-width: 640px) {
    width: 100%;
  }

  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.125rem;
    color: ${({ theme }) => theme.color.textSubtle};
    pointer-events: none;
  }

  input {
    padding-left: 2.375rem;
  }
`

type SearchFieldProps = {
  value: string
  placeholder: string
  width?: string
  onChange: (value: string) => void
}

export default function SearchField({ value, placeholder, width, onChange }: SearchFieldProps) {
  return (
    <Wrap $width={width}>
      <SearchIcon />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Wrap>
  )
}
