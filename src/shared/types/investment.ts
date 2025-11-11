export enum InvestmentType {
  STOCK = "STOCK",
  FUND = "FUND",
  FIXED_INCOME = "FIXED_INCOME",
  CRYPTO = "CRYPTO",
  OTHER = "OTHER",
}

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  amount: number;
  quantity?: number;
  unitPrice?: number;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
