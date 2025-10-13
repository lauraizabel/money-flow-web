import { create } from "zustand";
import { TransactionModel } from "@/shared/model/transaction.model";
import { transactionsService } from "@/features/transactions/services/transactions-service";

export interface TransactionStore {
  transactions: TransactionModel[];
  setTransactions: (transactions: TransactionModel[]) => void;
  fetchTransactions: () => Promise<void>;
  deleteTransaction: (id: string) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  fetchTransactions: async () => {
    const transactions = await transactionsService.getTransactions();
    set({ transactions });
  },
  deleteTransaction: (id: string) => {
    transactionsService.deleteTransaction(id);
    set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) }));
  },
}));
