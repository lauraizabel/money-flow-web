import api from "@/api/axios";
import { CreateTransactionDto } from "@/dto/transaction/create-transaction.dto";
import { TransactionModel } from "@/model/transaction-model";
import { Transaction } from "@/types/transaction";

export const transactionsService = {
  getTransactions: async () => {
    const response = await api.get<Transaction[]>('/transactions');
    return response.data.map((transaction) => new TransactionModel(transaction));
  },
  createTransaction: async (transaction: CreateTransactionDto) => {
    const response = await api.post<Transaction>('/transactions', transaction);
    return new TransactionModel(response.data);
  },
  deleteTransaction: async (id: string) => {
    await api.delete<Transaction>(`/transactions/${id}`);
  },
};