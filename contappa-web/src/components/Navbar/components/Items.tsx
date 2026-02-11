import styled from 'styled-components';

type ItemProps = {
  item: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
};

const ItemButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em 1em;
  background-color: transparent;
  color: white;
  border: 2px solid transparent;
  border-radius: 0.9em;
  font-size: 1.2rem;
  cursor: pointer;
  flex-wrap: wrap; 
  color: ${({ active }) => (active ? '#df8826ff' : '#fff')};
  &:hover {
    color: #df8826ff;
  }
`;

export default function Item({ item, icon, onClick, active }: ItemProps) {
  return (
    <ItemButton onClick={onClick} active={active}>
      {icon}
      {item}
    </ItemButton>
  );
}