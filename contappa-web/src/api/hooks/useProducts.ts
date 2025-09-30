import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateProductRequest, Product, ProductId, UpdateProductRequest } from "@api/__generated__"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "@api/client/services/products"

interface UpdateProductInput {
    productId: ProductId
    productData: UpdateProductRequest;
}


export const useProducts = () => {
    return useQuery<Product[], Error>({
        queryKey: ["products"],
        queryFn: () => getProducts(),
    });
}

export const useProductById = (productId: ProductId) => {
    return useQuery<Product, Error>({
        queryKey: ["products", productId],
        queryFn: () => getProductById(productId),
    });
}

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (productData: CreateProductRequest) => createProduct(productData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["products"]);
            }
        }
    )
}

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ productId, productData }: UpdateProductInput) => updateProduct(productId, productData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["products"]);
            }
        }
    )
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (productId: ProductId) => deleteProduct(productId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["products"]);
            }
        }
    )
}
