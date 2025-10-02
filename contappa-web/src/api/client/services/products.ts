import client from "@api/client/client"
import { CreateProductRequest, Product, UpdateProductRequest } from "@api/__generated__"
import { ProductId, CategoryId } from "@api/types/aliases";

const productsEndpoint = (categoryId: CategoryId) =>
    `categories/${categoryId}/products`;
const productsByIdEndpoint = (categoryId: CategoryId, productId: ProductId) =>
    `categories/${categoryId}/products/${productId}`;

export const getProducts = (categoryId: CategoryId): Promise<Product[]> =>
    client.get<Product[]>(productsEndpoint(categoryId)).then((response) => response.data);

export const getProductById = (categoryId: CategoryId, productId: ProductId): Promise<Product> =>
    client.get<Product>(productsByIdEndpoint(categoryId, productId)).then(response => response.data);

export const createProduct = (categoryId: CategoryId, productData: CreateProductRequest): Promise<Product> =>
    client.post<Product>(productsEndpoint(categoryId), productData).then((response) => response.data);

export const updateProduct = (categoryId: CategoryId, productId: ProductId, productData: UpdateProductRequest): Promise<Product> =>
    client.patch<Product>(productsByIdEndpoint(categoryId, productId), productData).then((response) => response.data);

export const deleteProduct = (categoryId: CategoryId, productId: ProductId): Promise<void> =>
    client.delete<void>(productsByIdEndpoint(categoryId, productId)).then((response) => response.data);
