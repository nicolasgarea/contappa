import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@api/__generated__";
import { CategoryId } from "@api/types/aliases";
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "@api/client/services/categories";

interface UpdateCategoryInput {
    categoryId: CategoryId;
    categoryData: UpdateCategoryRequest;
}

export const useCategories = () =>
    useQuery<Category[], Error>({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
    });

export const useCategoryById = (categoryId: CategoryId) =>
    useQuery<Category, Error>({
        queryKey: ["categories", categoryId],
        queryFn: () => getCategoryById(categoryId),
    });

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (categoryData: CreateCategoryRequest) => createCategory(categoryData),
        {
            onSuccess: () => queryClient.invalidateQueries(["categories"]),
        }
    );
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ categoryId, categoryData }: UpdateCategoryInput) => updateCategory(categoryId, categoryData),
        {
            onSuccess: () => queryClient.invalidateQueries(["categories"]),
        }
    );
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (categoryId: CategoryId) => deleteCategory(categoryId),
        {
            onSuccess: () => queryClient.invalidateQueries(["categories"]),
        }
    );
};
