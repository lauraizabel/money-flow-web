import { GoalStatus } from "@/features/transactions/const/goal-status";
import { GoalPriority } from "@/features/transactions/const/goal-priority";
import { Goal } from "@/shared/types/goal";

export class GoalModel {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  status: keyof typeof GoalStatus | undefined;
  priority: keyof typeof GoalPriority | undefined;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Goal) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.targetAmount = data.targetAmount;
    this.currentAmount = data.currentAmount;
    this.targetDate = data.targetDate;
    this.status = data.status as unknown as keyof typeof GoalStatus;
    this.priority = data.priority as unknown as keyof typeof GoalPriority;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static fromApi(data: Goal) {
    return new GoalModel(data);
  }

  get isCompleted(): boolean {
    return this.status === GoalStatus.COMPLETED;
  }

  get isPaused(): boolean {
    return this.status === GoalStatus.PAUSED;
  }

  get isCancelled(): boolean {
    return this.status === GoalStatus.CANCELLED;
  }

  get isActive(): boolean {
    return this.status === GoalStatus.ACTIVE;
  }
}