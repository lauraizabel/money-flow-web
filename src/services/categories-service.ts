import api from "@/api/axios";
import { CategoryModel } from "@/model/category-model";
import { Category } from "@/types/categories";

export const categoriesService = {
  getCategories: async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data.map((category) => new CategoryModel(category));
  },
};