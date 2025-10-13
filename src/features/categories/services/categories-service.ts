import api from "@/shared/api/axios";
import { CategoryModel } from "@/shared/model/category.model";
import { Category } from "@/shared/types/categories";
import { CreateCategoryDto } from "@/features/categories/dto/create-category.dto";

export const categoriesService = {
  getCategories: async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data.map((category) => new CategoryModel(category));
  },
  createCategory: async (category: CreateCategoryDto) => {
    const response = await api.post<Category>('/categories', category);
    return new CategoryModel(response.data);
  },
  deleteCategory: async (id: string) => {
    await api.delete(`/categories/${id}`);
  },
};