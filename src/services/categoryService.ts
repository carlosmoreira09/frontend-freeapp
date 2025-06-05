import api from './api';
import type {Category} from "../types/category.ts";

interface CategoryCreateUpdatePayload {
    name: string;
    description: string;
}

// Category service
const categoryService = {
    // Get all categories
    getCategories: async (): Promise<Category[]> => {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },

    // Get category by ID
    getCategoryById: async (id: string): Promise<Category> => {
        const response = await api.get<Category>(`/categories/${id}`);
        return response.data;
    },

    // Create a new category
    createCategory: async (data: CategoryCreateUpdatePayload): Promise<Category> => {
        const response = await api.post<Category>('/categories', data);
        return response.data;
    },

    // Update an existing category
    updateCategory: async (id: string, data: CategoryCreateUpdatePayload): Promise<Category> => {
        const response = await api.put<Category>(`/categories/${id}`, data);
        return response.data;
    },

    // Delete a category
    deleteCategory: async (id: string): Promise<void> => {
        await api.delete(`/categories/${id}`);
    }
};

export default categoryService;
