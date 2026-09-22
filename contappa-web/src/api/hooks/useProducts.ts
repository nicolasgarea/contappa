import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateProductRequest, Product, UpdateProductRequest } from '@api/__generated__'
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '@api/client/services/products'
import { ProductId, CategoryId } from '@api/types/aliases'

interface UpdateProductInput {
  categoryId: CategoryId
  productId: ProductId
  productData: UpdateProductRequest
}

export const productsKey = (categoryId?: CategoryId) =>
  ['categories', categoryId, 'products'] as const

export const useProducts = (categoryId?: CategoryId) => {
  return useQuery<Product[], Error>({
    queryKey: productsKey(categoryId),
    queryFn: () => getProducts(categoryId!),
    enabled: !!categoryId,
  })
}

export const useProductsByCategories = (categoryIds: CategoryId[]) => {
  const results = useQueries({
    queries: categoryIds.map((categoryId) => ({
      queryKey: productsKey(categoryId),
      queryFn: () => getProducts(categoryId),
    })),
  })

  return {
    products: results.flatMap((result) => result.data ?? []),
    isLoading: results.some((result) => result.isLoading),
  }
}

export const useProductById = (categoryId: CategoryId, productId: ProductId) => {
  return useQuery<Product, Error>({
    queryKey: [...productsKey(categoryId), productId],
    queryFn: () => getProductById(categoryId, productId),
    enabled: !!categoryId && !!productId,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (productData: CreateProductRequest & { categoryId: CategoryId }) =>
      createProduct(productData.categoryId, productData),
    {
      onSuccess: (_, productData) => {
        queryClient.invalidateQueries(productsKey(productData.categoryId))
      },
    },
  )
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ categoryId, productId, productData }: UpdateProductInput) =>
      updateProduct(categoryId, productId, productData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories'])
      },
    },
  )
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ categoryId, productId }: { categoryId: CategoryId; productId: ProductId }) =>
      deleteProduct(categoryId, productId),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(productsKey(variables.categoryId))
      },
    },
  )
}
