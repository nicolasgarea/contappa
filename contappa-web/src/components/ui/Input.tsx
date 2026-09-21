import styled from 'styled-components'

const fieldStyles = `
  width: 100%;
  padding: 0.625rem 0.875rem;
  border-radius: 10px;
  border: 1px solid;
  transition: all 140ms ease;

  &::placeholder {
    color: #98A1AE;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Input = styled.input`
  ${fieldStyles}
  background-color: ${({ theme }) => theme.color.surface};
  border-color: ${({ theme }) => theme.color.border};
  color: ${({ theme }) => theme.color.text};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.color.borderStrong};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.accent[500]};
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
`

export const Select = styled.select`
  ${fieldStyles}
  background-color: ${({ theme }) => theme.color.surface};
  border-color: ${({ theme }) => theme.color.border};
  color: ${({ theme }) => theme.color.text};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23697586' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.25rem;

  &:hover {
    border-color: ${({ theme }) => theme.color.borderStrong};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.accent[500]};
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
`

export const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: 0.375rem;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
`

export const FieldError = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.color.danger.base};
  margin-top: 0.375rem;
`

export default Input
