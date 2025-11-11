import api from "@/shared/api/axios";
import { Investment } from "@/shared/types/investment";
import { InvestmentModel } from "../model/investment-model";
import { CreateInvestmentDto } from "../dto/create-investment.dto";
import { UpdateInvestmentDto } from "../dto/update-investment.dto";

export const investmentsService = {
  getInvestments: async (): Promise<InvestmentModel[]> => {
    const response = await api.get<Investment[]>("/investments");
    return response.data.map((investment) => new InvestmentModel(investment));
  },

  createInvestment: async (
    investment: CreateInvestmentDto
  ): Promise<InvestmentModel> => {
    const response = await api.post<Investment>("/investments", investment);
    return new InvestmentModel(response.data);
  },

  updateInvestment: async (
    id: string,
    investment: UpdateInvestmentDto
  ): Promise<InvestmentModel> => {
    const response = await api.put<Investment>(
      `/investments/${id}`,
      investment
    );
    return new InvestmentModel(response.data);
  },

  deleteInvestment: async (id: string): Promise<void> => {
    await api.delete(`/investments/${id}`);
  },
};
