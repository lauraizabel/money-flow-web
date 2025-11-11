import api from "@/shared/api/axios";
import { GoalModel } from "@/features/goals/model/goal-model";
import { Goal } from "@/shared/types/goal";
import { CreateGoalDto } from "../dto/create-goal.dto";

export const goalsService = {
  createGoal: async (goal: CreateGoalDto) => {
    const response = await api.post<Goal>('/goals', goal);
    return new GoalModel(response.data);
  },
  fetchGoals: async () => {
    const response = await api.get<Goal[]>('/goals');
    return response.data.map((goal) => new GoalModel(goal));
  },
  updateGoalProgress: async (id: string, amount: number) => {
    const response = await api.put<Goal>(`/goals/${id}/progress`, { amount });
    return new GoalModel(response.data);
  },
  deleteGoal: async (id: string) => {
    await api.delete(`/goals/${id}`);
  },
};