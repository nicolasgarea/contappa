import styled from "styled-components";

const StyledButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

export default function Button({ label, onClick }: { label: string; onClick: () => void }) {
    return <StyledButton onClick={onClick}>{label}</StyledButton>;
}