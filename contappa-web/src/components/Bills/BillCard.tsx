import styled from "styled-components";

type BillCardProps = {
  bill: {
    id: string;
    amount: number;
    paid: boolean;
    date: string;
  };
  onClick?: () => void;
  selected?: boolean;
};

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background-color: #f3f4f6;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
  border: 1px solid #df8826ff;
  border-radius: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BillLabel = styled.span`
  font-weight: 700;
  font-size: 1rem;2025
  color: #111827;
`;

const Amount = styled.span`
  font-size: 1.55rem;
  font-weight: 700;
  color: #df8826ff;
  align-self: flex-end;
`;

const DateText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

export default function BillCard({ bill, onClick }: BillCardProps) {
  return (
    <Card onClick={onClick}>
      <Header>
        <BillLabel>#{bill.id.slice(0, 5)}</BillLabel>
        <DateText>{new Date(bill.date).toLocaleDateString()}</DateText>
      </Header>

      <Amount>${bill.amount.toFixed(2)}</Amount>

    </Card>
  );
}