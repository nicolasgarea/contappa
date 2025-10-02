import client from "@api/client/client"
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@api/__generated__"
import { CategoryId } from "@api/types/aliases"

const categoriesEndpoint = "categories";
const categoriesByIdEndpoint = (categoryId: CategoryId) => `categories/${categoryId}`;

export const getCategories = (): Promise<Category[]> =>
    client.get<Category[]>(categoriesEndpoint).then(response => response.data);

export const createCategory = (categoryData: CreateCategoryRequest): Promise<Category> =>
    client.post<Category>(categoriesEndpoint, categoryData).then(response => response.data);

export const getCategoryById = (categoryId: CategoryId): Promise<Category> =>
    client.get<Category>(categoriesByIdEndpoint(categoryId)).then(response => response.data);

export const updateCategory = (categoryId: CategoryId, categoryData: UpdateCategoryRequest): Promise<Category> =>
    client.patch<Category>(categoriesByIdEndpoint(categoryId), categoryData).then(response => response.data);

export const deleteCategory = (categoryId: CategoryId): Promise<void> =>
    client.delete<void>(categoriesByIdEndpoint(categoryId)).then(response => response.data);
