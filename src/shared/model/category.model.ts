import { CATEGORY_TYPE } from "@/shared/constants/category-type.const";
import { Category } from "@/types/categories";

export class CategoryModel {
  id: string;
  name: string;
  type: string;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(data: Category) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.color = data.color;
    this.icon = data.icon;
    this.isDefault = data.isDefault;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  fromApi(data: Category) {
    return new CategoryModel(data);
  }

  get categoryName(): string {
    return `${this.icon} ${this.name}`;
  }

  get isIncome(): boolean {
    return this.type === CATEGORY_TYPE.INCOME;
  }

  get isExpense(): boolean {
    return this.type === CATEGORY_TYPE.EXPENSE;
  }
}