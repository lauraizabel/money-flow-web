import api from "@/api/axios";
import { CategoryModel } from "@/model/category-model";
import { Category } from "@/types/categories";
import { CreateCategoryDto } from "@/dto/category/create-category.dto";

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