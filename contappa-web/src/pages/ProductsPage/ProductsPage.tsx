import { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "@components/Navbar/Navbar";
import Button from "@components/Button/Button";
import ProductCard from "./components/ProductCard";
import ProductForm, { ProductFormInputs } from "./components/ProductForm";
import { useProducts, useCreateProduct, useDeleteProduct } from "@api/hooks/useProducts";
import { useCategories } from "@api/hooks/useCategories";
import { useQueryClient } from "@tanstack/react-query";

const PageContainer = styled.div`
  background-color: #f4f7fa;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: sans-serif;
  margin: 2rem 4rem 1rem 4rem;
  border-bottom: 1px solid #ccc;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem 4rem;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

export default function ProductPage() {
    const [showForm, setShowForm] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

    const queryClient = useQueryClient();

    const { data: categories, isLoading: loadingCategories } = useCategories();

    useEffect(() => {
        if (categories && categories.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(categories[0].id!);
        }
    }, [categories, selectedCategoryId]);

    const { data: products, isLoading: loadingProducts } =
        useProducts(selectedCategoryId, { enabled: !!selectedCategoryId });

    const createProductMutation = useCreateProduct();
    const deleteProductMutation = useDeleteProduct();

    const handleCreateProduct = (data: ProductFormInputs) => {
        const categoryId = data.categoryId || selectedCategoryId;
        if (!categoryId) return;

        createProductMutation.mutate(
            { ...data, categoryId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries(["products", categoryId]);
                    setShowForm(false);
                },
            }
        );
    };

    const handleDeleteProduct = (productId: string, categoryId: string) => {
        deleteProductMutation.mutate(
            { productId, categoryId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries(["products", categoryId]);
                },
            }
        );
    };

    if (loadingCategories || loadingProducts) return <div>Loading...</div>;
    if (!categories || categories.length === 0) return <div>No categories available</div>;

    return (
        <PageContainer>
            <Navbar />

            {showForm && (
                <ProductForm
                    categories={categories.filter((cat): cat is { id: string; name: string } => !!cat.id)}
                    selectedCategoryId={selectedCategoryId}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleCreateProduct}
                />
            )}

            <Header>
                <h1>Products</h1>

                <Select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </Select>

                <Button
                    label="+ Create Product"
                    color="#df8826ff"
                    onClick={() => setShowForm(true)}
                />
            </Header>

            <ProductsGrid>
                {products?.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={{
                            id: product.id!,
                            name: product.name!,
                            price: product.price!,
                            imageUrl: product.imageUrl,
                        }}
                        onDelete={() => handleDeleteProduct(product.id!, product.categoryId!)}
                    />
                ))}
            </ProductsGrid>
        </PageContainer>
    );
}
