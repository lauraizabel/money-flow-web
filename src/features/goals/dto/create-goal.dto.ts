import { GoalPriority } from "@/features/transactions/const/goal-priority";

export interface CreateGoalDto {
  title: string;
  description?: string;
  targetAmount: number;
  targetDate?: string;
  categoryId: string;
  priority?: keyof typeof GoalPriority;
}
