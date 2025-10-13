import { categoriesService } from "@/features/categories/services/categories-service";
import { CategoryModel } from "@/shared/model/category.model";
import { CATEGORY_TYPE } from "@/shared/constants/category-type.const";
import { create } from "zustand";
import { CreateCategoryDto } from "../dto/create-category.dto";

export interface CategoryStore {
  categories: CategoryModel[];
  setCategories: (categories: CategoryModel[]) => void;
  fetchCategories: () => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  expensesCategories: CategoryModel[];
  incomesCategories: CategoryModel[];
  addCategory: (category: CreateCategoryDto) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  setCategories: (categories) => {
    set({ 
      categories,
      expensesCategories: categories?.filter((category) => category.type === CATEGORY_TYPE.EXPENSE) || [],
      incomesCategories: categories?.filter((category) => category.type === CATEGORY_TYPE.INCOME) || []
    });
  },
  fetchCategories: async () => {
    const categories = await categoriesService.getCategories();
    set({ 
      categories,
      expensesCategories: categories?.filter((category) => category.type === CATEGORY_TYPE.EXPENSE) || [],
      incomesCategories: categories?.filter((category) => category.type === CATEGORY_TYPE.INCOME) || []
    });
  },
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  expensesCategories: [],
  incomesCategories: [],
  addCategory: async (category: CreateCategoryDto) => {
    const newCategory = await categoriesService.createCategory(category);
    set({ categories: [...get().categories, newCategory] });
  },
}));