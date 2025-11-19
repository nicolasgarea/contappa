import styled from "styled-components";

const StyledButton = styled.button < { color?: string }>`
  background: ${(props) => props.color || "linear-gradient(135deg, #4caf50, #2e7d32)"};
  color: #fff;
  padding: 0.65rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: all 0.25s ease;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.25); 
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.18);
  }
`;

type ButtonProps = {
  label: string;
  onClick?: () => void;
  typeButton?: "button" | "submit" | "reset";
  color?: string;
};

export default function Button({ label, onClick, typeButton = "button", color }: ButtonProps) {
  return <StyledButton onClick={onClick} type={typeButton} color={color} >{label}</StyledButton>;
}