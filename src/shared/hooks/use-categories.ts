import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@/features/categories/services/categories-service";
    
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await categoriesService.getCategories();
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
};    