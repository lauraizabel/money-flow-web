import api from "@/shared/api/axios";
import { CreateTransactionDto } from "@/features/transactions/dto/create-transaction.dto";
import { UpdateTransactionDto } from "@/features/transactions/dto/update-transaction.dto";
import { TransactionModel } from "@/shared/model/transaction.model";
import { Transaction } from "@/shared/types/transaction";
import { TransactionFilters } from "../store/use-transaction-store";

export const transactionsService = {
  getTransactions: async () => {
    const response = await api.get<Transaction[]>('/transactions');
    return response.data.map((transaction) => new TransactionModel(transaction));
  },
  getTransactionsWithFilters: async (filters: TransactionFilters) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.type) params.append('type', filters.type);

    const response = await api.get<Transaction[]>(`/transactions?${params.toString()}`);
    return response.data.map((transaction) => new TransactionModel(transaction));
  },
  createTransaction: async (transaction: CreateTransactionDto) => {
    const response = await api.post<Transaction>('/transactions', transaction);
    return new TransactionModel(response.data);
  },
  updateTransaction: async (id: string, transaction: UpdateTransactionDto) => {
    const response = await api.put<Transaction>(`/transactions/${id}`, transaction);
    return new TransactionModel(response.data);
  },
  deleteTransaction: async (id: string) => {
    await api.delete<Transaction>(`/transactions/${id}`);
  },
};