import client from "@api/client/client"
import { CreateProductRequest, Product, ProductId, UpdateProductRequest } from "@api/__generated__"

const productsEndpoint = "products";
const productsByIdEndpoint = (productId: ProductId) => `products/${productId}`;

export const getProducts = (): Promise<Product[]> => client.get<Product[]>(productsEndpoint).then((response) => response.data);

export const getProductById = (productId: ProductId): Promise<Product> => client.get<Product>(productsByIdEndpoint(productId)).then(response => response.data);

export const createProduct = (productData: CreateProductRequest): Promise<Product> => client.post<Product>(productsEndpoint, productData).then((response) => response.data);

export const updateProduct = (productId: ProductId, productData: UpdateProductRequest): Promise<Product> => client.patch<Product>(productsByIdEndpoint(productId), productData).then((response) => response.data);

export const deleteProduct = (productId: ProductId): Promise<void> => client.delete<void>(productsByIdEndpoint(productId)).then((response) => response.data);