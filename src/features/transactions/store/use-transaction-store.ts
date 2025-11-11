import { create } from "zustand";
import { TransactionModel } from "@/shared/model/transaction.model";
import { transactionsService } from "@/features/transactions/services/transactions-service";
import { UpdateTransactionDto } from "@/features/transactions/dto/update-transaction.dto";

export interface TransactionFilters {
  search?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: 'INCOME' | 'EXPENSE';
}

export interface TransactionStore {
  transactions: TransactionModel[];
  filteredTransactions: TransactionModel[];
  filters: TransactionFilters;
  isLoading: boolean;
  setTransactions: (transactions: TransactionModel[]) => void;
  setFilters: (filters: TransactionFilters) => void;
  fetchTransactions: (filters?: TransactionFilters) => Promise<void>;
  updateTransaction: (id: string, transaction: UpdateTransactionDto) => Promise<void>;
  deleteTransaction: (id: string) => void;
  applyFilters: () => void;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  filteredTransactions: [],
  filters: {},
  isLoading: false,
  
  setTransactions: (transactions) => {
    set({ transactions });
    get().applyFilters();
  },
  
  setFilters: (filters) => {
    set({ filters });
    // Debounce effect
    setTimeout(() => {
      get().fetchTransactions(filters);
    }, 300);
  },
  
  fetchTransactions: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const transactions = await transactionsService.getTransactionsWithFilters(filters);
      set({ transactions, isLoading: false });
      get().applyFilters();
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching transactions:', error);
    }
  },
  
  updateTransaction: async (id: string, transaction: UpdateTransactionDto) => {
    try {
      const updatedTransaction = await transactionsService.updateTransaction(id, transaction);
      set((state) => ({
        transactions: state.transactions.map((t) => 
          t.id === id ? updatedTransaction : t
        ),
        filteredTransactions: state.filteredTransactions.map((t) => 
          t.id === id ? updatedTransaction : t
        )
      }));
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  },
  
  deleteTransaction: async (id: string) => {
    try {
      await transactionsService.deleteTransaction(id);
      set((state) => ({ 
        transactions: state.transactions.filter((t) => t.id !== id),
        filteredTransactions: state.filteredTransactions.filter((t) => t.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  },
  
  applyFilters: () => {
    const { transactions, filters } = get();
    
    const filtered = transactions.filter((transaction) => {
      // Search filter
      if (filters.search) {
        const matchesSearch = transaction.description
          .toLowerCase()
          .includes(filters.search.toLowerCase());
        if (!matchesSearch) return false;
      }
      
      // Category filter
      if (filters.categoryId) {
        if (transaction.category?.id !== filters.categoryId) return false;
      }
      
      // Type filter
      if (filters.type) {
        if (transaction.type !== filters.type) return false;
      }
      
      // Date filters
      if (filters.dateFrom) {
        if (transaction.date < new Date(filters.dateFrom)) return false;
      }
      
      if (filters.dateTo) {
        if (transaction.date > new Date(filters.dateTo)) return false;
      }
      
      return true;
    });
    
    set({ filteredTransactions: filtered });
  },
}));
