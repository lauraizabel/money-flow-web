import { categoriesService } from "@/services/categories-service";
import { CategoryModel } from "@/model/category-model";
import { CATEGORY_TYPE } from "@/const/category-type.const";
import { create } from "zustand";

export interface CategoryStore {
  categories: CategoryModel[];
  setCategories: (categories: CategoryModel[]) => void;
  fetchCategories: () => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  expensesCategories: CategoryModel[];
  incomesCategories: CategoryModel[];
  setExpensesCategories: (expensesCategories: CategoryModel[]) => void;
  setIncomesCategories: (incomesCategories: CategoryModel[]) => void;
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
  setExpensesCategories: (categories: CategoryModel[]) => set({ expensesCategories: categories?.filter((category) => category.type === CATEGORY_TYPE.EXPENSE) || [] }),
  setIncomesCategories: (categories: CategoryModel[]) => set({ incomesCategories: categories?.filter((category) => category.type === CATEGORY_TYPE.INCOME) || [] }),
}));