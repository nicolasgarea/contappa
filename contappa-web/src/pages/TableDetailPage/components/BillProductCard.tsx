import styled from "styled-components";

type BillProductCardProps = {
    product: {
        name: string;
        quantity: number;
        price: number;
    };
};

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  }
`;

const ProductName = styled.div`
  font-weight: 600;
  font-size: 1rem;
`;

const ProductQuantity = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ProductPrice = styled.div`
  font-weight: 700;
  font-size: 1rem;
`;

export default function BillProductCard({ product }: BillProductCardProps) {
    return (
        <Card>
            <ProductName>{product.name}</ProductName>
            <ProductQuantity>x{product.quantity}</ProductQuantity>
            <ProductPrice>${(product.price * product.quantity).toFixed(2)}</ProductPrice>
        </Card>
    );
}
