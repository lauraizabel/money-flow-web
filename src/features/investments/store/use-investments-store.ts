import { create } from "zustand";
import { InvestmentModel } from "../model/investment-model";
import { investmentsService } from "../services/investments-service";
import { CreateInvestmentDto } from "../dto/create-investment.dto";
import { UpdateInvestmentDto } from "../dto/update-investment.dto";
import { toast } from "sonner";

export interface InvestmentsStore {
  investments: InvestmentModel[];
  isLoading: boolean;
  error: string | null;
  fetchInvestments: () => Promise<void>;
  createInvestment: (investment: CreateInvestmentDto) => Promise<void>;
  updateInvestment: (
    id: string,
    investment: UpdateInvestmentDto
  ) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
}

export const useInvestmentsStore = create<InvestmentsStore>((set, get) => ({
  investments: [],
  isLoading: false,
  error: null,

  fetchInvestments: async () => {
    set({ isLoading: true, error: null });
    try {
      const investments = await investmentsService.getInvestments();
      set({ investments, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao carregar investimentos";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  createInvestment: async (investment: CreateInvestmentDto) => {
    set({ isLoading: true, error: null });
    try {
      const newInvestment = await investmentsService.createInvestment(
        investment
      );
      set((state) => ({
        investments: [newInvestment, ...state.investments],
        isLoading: false,
      }));
      toast.success("Investimento criado com sucesso!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar investimento";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  updateInvestment: async (id: string, investment: UpdateInvestmentDto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedInvestment = await investmentsService.updateInvestment(
        id,
        investment
      );
      set((state) => ({
        investments: state.investments.map((inv) =>
          inv.id === id ? updatedInvestment : inv
        ),
        isLoading: false,
      }));
      toast.success("Investimento atualizado com sucesso!");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao atualizar investimento";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  deleteInvestment: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await investmentsService.deleteInvestment(id);
      set((state) => ({
        investments: state.investments.filter((inv) => inv.id !== id),
        isLoading: false,
      }));
      toast.success("Investimento excluído com sucesso!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao excluir investimento";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
}));
