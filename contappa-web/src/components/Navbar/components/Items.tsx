import styled from 'styled-components';

type ItemProps = {
  item: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

const ItemButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em 1em;
  background-color: transparent;
  color: white;
  border: 2px solid transparent;
  border-radius: 0.9em;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  flex-wrap: wrap; 
`;

export default function Item({ item, icon, onClick }: ItemProps) {
  return (
    <ItemButton onClick={onClick}>
      {icon}
      {item}
    </ItemButton>
  );
}