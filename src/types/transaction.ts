import { Category } from "./categories";

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
  category: Category;
  tags?: string[];
}