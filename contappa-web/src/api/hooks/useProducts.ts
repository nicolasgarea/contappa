import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateProductRequest, Product, UpdateProductRequest } from "@api/__generated__"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "@api/client/services/products"
import { ProductId, CategoryId } from "@api/types/aliases"

interface UpdateProductInput {
    productId: ProductId
    productData: UpdateProductRequest;
}


export const useProducts = (categoryId: CategoryId) => {
    return useQuery<Product[], Error>({
        queryKey: ["categories", categoryId, "products"],
        queryFn: () => getProducts(categoryId),
    });
}

export const useProductById = (categoryId: CategoryId, productId: ProductId) => {
    return useQuery<Product, Error>({
        queryKey: ["categories", categoryId, "products", productId],
        queryFn: () => getProductById(categoryId, productId),
    });
}

export const useCreateProduct = (categoryId: CategoryId) => {
    const queryClient = useQueryClient();
    return useMutation(
        (productData: CreateProductRequest) => createProduct(categoryId, productData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["categories", categoryId, "products"]);
            }
        }
    )
}

export const useUpdateProduct = (categoryId: CategoryId) => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ productId, productData }: UpdateProductInput) => updateProduct(categoryId, productId, productData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["categories", categoryId, "products"]);
            }
        }
    )
}

export const useDeleteProduct = (categoryId: CategoryId) => {
    const queryClient = useQueryClient();
    return useMutation(
        (productId: ProductId) => deleteProduct(categoryId, productId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["categories", categoryId, "products"]);
            }
        }
    )
}
