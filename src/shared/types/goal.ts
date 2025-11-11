import { GoalPriority } from "@/features/transactions/const/goal-priority";
import { GoalStatus } from "@/features/transactions/const/goal-status";

export interface Goal {
    createdAt?: Date;
    currentAmount?: number;
    description?: string;
    id?: string;
    priority?: typeof GoalPriority;
    status?: typeof GoalStatus;
    targetAmount?: number;
    targetDate?: Date;
    title?: string;
    updatedAt?: Date;
}