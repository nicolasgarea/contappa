import styled from "styled-components";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

type TableCardProps = {
  number: number;
  available: boolean;
  activeBillAmount?: number;
  onClick: () => void;
};

const Card = styled.div<{ available: boolean }>`
  border-left: 6px solid ${({ available }) => (available ? "#10b981" : "#ff000085")};
  background-color: #ecfdf5;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  margin: 1.5rem 0.6rem;
  display: flex;
  flex-direction: column;
  flex: 0 1 250px;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(0,0,0,0.25);
  }
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TableNumber = styled.span`
  font-size: 1.25rem;
  font-family: sans-serif;
  font-weight: 700;
  color: #111827;
`;

const StatusLabel = styled.span<{ available: boolean }>`
  font-size: 0.65rem;
  font-weight: 600;
  font-family: sans-serif;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  color: white;
  background-color: ${({ available }) => (available ? "#10b981" : "#ff0000ce")};
`;

const IconWrapper = styled.div<{ available: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 1.4rem;
  border-bottom: 1px solid #ccc;
  color: ${({ available }) => (available ? "#10b981" : "#ff0000ce")};
`;

const Price = styled.span<{ available: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    font-size: 40px;
    font-weight: 700;
    font-family: sans-serif;
    color: ${({ available }) => (available ? "#00000038" : "#ff0000ce")};
`;

export default function TableCard({ number, available, activeBillAmount, onClick }: TableCardProps) {
  const Icon = available ? LocalCafeIcon : RestaurantMenuIcon;

  return (
    <Card available={available} onClick={onClick}>
      <TableHeader>
        <TableNumber>Table {number}</TableNumber>
        <StatusLabel available={available}>
          {available ? "Available" : "Occupied"}
        </StatusLabel>
      </TableHeader>

      <IconWrapper available={available}>
        <Icon style={{ fontSize: '2.4rem' }} />
      </IconWrapper>

      <Price available={available}>
        {activeBillAmount != null
          ? `$${activeBillAmount.toFixed(2)}`
          : "$0.00"}
      </Price>
    </Card>
  );
}
