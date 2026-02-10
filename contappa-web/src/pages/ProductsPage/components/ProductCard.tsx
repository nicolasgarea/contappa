import styled from "styled-components";

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, #f1f3f5, #e5e7eb);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 1rem 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
`;

const ProductName = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  color: #111827;
  text-align: center;
`;

const ProductPrice = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;
`;

const DeleteButton = styled.button`
  background: transparent;
  color: #ef4444;
  border: 1px solid #fecaca;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: #fee2e2;
    color: #b91c1c;
  }
`;

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  onClick?: () => void;
  onDelete: () => void;
};

export default function ProductCard({ product, onClick, onDelete }: ProductCardProps) {
  const placeholderUrl = "https://dummyimage.com/600x400/e5e7eb/9ca3af&text=No+Image";
  return (
    <Card onClick={onClick}>
      <ImageWrapper>
        <ProductImage src={product.imageUrl || placeholderUrl} alt={product.name} />
      </ImageWrapper>

      <Content>
        <ProductName>{product.name}</ProductName>
        <ProductPrice>${product.price.toFixed(2)}</ProductPrice>

        <Actions>
          <DeleteButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Delete
          </DeleteButton>
        </Actions>
      </Content>
    </Card>
  );
}