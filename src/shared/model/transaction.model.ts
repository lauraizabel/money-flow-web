// src/models/Transaction.ts

import { Transaction as TransactionType } from "@/types/transaction";
import { CategoryModel } from "./category.model";
import { CATEGORY_TYPE } from "@/shared/constants/category-type.const";

export class TransactionModel {
  id: string;
  description: string;
  amount: number;
  date: Date;
  categoryId: string;
  category?: CategoryModel | null;
  type: string;

  constructor(data: TransactionType) {
    this.id = data.id;
    this.description = data.description;
    this.amount = data.amount;
    this.date = new Date(data.date);
    this.categoryId = data.category?.id;
    this.category = data.category ? new CategoryModel(data.category) : null;
    this.type = data.type;
  }

  static fromApi(data: TransactionType) {
    return new TransactionModel(data);
  }

  get isIncome(): boolean {
    return this.type === CATEGORY_TYPE.INCOME;
  }

  get isExpense(): boolean {
    return this.type === CATEGORY_TYPE.EXPENSE;
  }
}
