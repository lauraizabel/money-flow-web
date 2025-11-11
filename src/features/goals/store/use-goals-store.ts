import { GoalModel } from "../model/goal-model";
import { goalsService } from "../services/goals-service";
import { CreateGoalDto } from "../dto/create-goal.dto";
import { create } from "zustand";

export interface GoalsStore {
  goals: GoalModel[];
  setGoals: (goals: GoalModel[]) => void;
  fetchGoals: () => Promise<void>;
  createGoal: (goal: CreateGoalDto) => Promise<void>;
  addValueToGoal: (goalId: string, amount: number) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useGoalsStore = create<GoalsStore>((set, get) => ({
  goals: [],
  setGoals: (goals) => set({ goals }),
  fetchGoals: async () => {
    const goals = await goalsService.fetchGoals();
    set({ goals });
  },
  createGoal: async (goalData: CreateGoalDto) => {
    const newGoal = await goalsService.createGoal(goalData);
    const currentGoals = get().goals;
    set({ goals: [...currentGoals, newGoal] });
  },
  addValueToGoal: async (goalId: string, amount: number) => {
    const updatedGoal = await goalsService.updateGoalProgress(goalId, amount);
    const currentGoals = get().goals;
    const updatedGoals = currentGoals.map(goal => 
      goal.id === goalId ? updatedGoal : goal
    );
    set({ goals: updatedGoals });
  },
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
