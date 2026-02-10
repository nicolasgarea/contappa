import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateProductRequest, Product, UpdateProductRequest } from "@api/__generated__"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "@api/client/services/products"
import { ProductId, CategoryId } from "@api/types/aliases"

interface UpdateProductInput {
  productId: ProductId
  productData: UpdateProductRequest;
}


export const useProducts = (categoryId?: string, options = {}) => {

  return useQuery(
    ["products", categoryId],
    () => getProducts(categoryId!),
    {
      ...options,
      enabled: !!categoryId,
    }
  );
};


export const useProductById = (categoryId: CategoryId, productId: ProductId) => {
  return useQuery<Product, Error>({
    queryKey: ["categories", categoryId, "products", productId],
    queryFn: () => getProductById(categoryId, productId),
  });
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (productData: CreateProductRequest & { categoryId: string }) =>
      createProduct(productData.categoryId, productData),
    {
      onSuccess: (_, productData) => {
        queryClient.invalidateQueries(["categories", productData.categoryId, "products"]);
      },
    }
  );
};

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

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ categoryId, productId }: { categoryId: string; productId: string }) =>
      deleteProduct(categoryId, productId),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["categories", variables.categoryId, "products"]);
      },
      onError: (error: any) => {
        console.error("Error deleting product:", error);
      },
    }
  );
};
