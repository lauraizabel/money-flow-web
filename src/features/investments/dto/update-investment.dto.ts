import { InvestmentType } from "@/shared/types/investment";

export interface UpdateInvestmentDto {
  name?: string;
  type?: InvestmentType;
  amount?: number;
  quantity?: number;
  unitPrice?: number;
  date?: string;
  description?: string;
}
