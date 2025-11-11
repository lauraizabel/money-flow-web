import { TrendingDown, TrendingUp, Wallet, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import { Card } from "@/shared/ui/card";
import { BalanceCard } from "@/shared/components/balance-card";
import { TransactionList } from "@/features/transactions/components/transaction-list";
import { EditTransactionForm } from "@/features/transactions/components/edit-transaction-form";
import { FinanceChart } from "@/features/transactions/components/finance-chart";
import { MonthlyComparisonChart } from "@/features/transactions/components/monthly-comparison-chart";
import { BalanceEvolutionChart } from "@/features/transactions/components/balance-evolution-chart";
import { MonthSelector } from "@/features/transactions/components/month-selector";
import { useTransactionStore } from "@/features/transactions/store/use-transaction-store";
import { useReportStore } from "../store/use-report-store";
import { TransactionModel } from "@/shared/model/transaction.model";
import { UpdateTransactionDto } from "@/features/transactions/dto/update-transaction.dto";

const Overview = () => {
  const { report, fetchReport, isLoading } = useReportStore();
  const { deleteTransaction: deleteTransactionStore, updateTransaction: updateTransactionStore } = useTransactionStore();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [editingTransaction, setEditingTransaction] = useState<TransactionModel | null>(null);

  const getMonthDateRange = (monthString: string) => {
    const [year, month] = monthString.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    return {
      dateFrom: startDate.toISOString().split('T')[0],
      dateTo: endDate.toISOString().split('T')[0],
    };
  };

  const fetchReportData = useCallback(async (month: string) => {
    await fetchReport({
      type: 'MONTHLY',
      period: 'CUSTOM',
      ...getMonthDateRange(month),
    });
  }, [fetchReport]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    fetchReportData(month);
  };

  const deleteTransaction = (id: string) => {
    deleteTransactionStore(id);
    fetchReportData(selectedMonth);
  };

  const handleEditTransaction = (transaction: TransactionModel) => {
    setEditingTransaction(transaction);
  };

  const handleUpdateTransaction = async (id: string, transaction: UpdateTransactionDto) => {
    await updateTransactionStore(id, transaction);
    setEditingTransaction(null);
    fetchReportData(selectedMonth);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  useEffect(() => {
    fetchReportData(selectedMonth);
  }, [fetchReportData, selectedMonth]);

  const monthlyTransactions = report?.transactions?.filter((transaction: TransactionModel) => {
    const transactionMonth = new Date(transaction.date).toISOString().slice(0, 7);
    return transactionMonth === selectedMonth;
  }) || [];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Visão Geral</h1>
          <p className="text-muted-foreground">
            Acompanhe suas finanças e gastos mensais
          </p>
        </div>
        <MonthSelector 
          selectedMonth={selectedMonth} 
          onMonthChange={handleMonthChange} 
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando dados...</span>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <BalanceCard
            title="Saldo Total"
            amount={report?.summary.balance || 0}
            icon={Wallet}
            variant={(report?.summary.balance || 0) >= 0 ? "success" : "destructive"}
          />
          <BalanceCard
            title="Receitas"
            amount={report?.summary.totalIncome || 0}
            icon={TrendingUp}
            variant="success"
          />
          <BalanceCard
            title="Despesas"
            amount={report?.summary.totalExpense || 0}
            icon={TrendingDown}
            variant="destructive"
          />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <FinanceChart transactions={monthlyTransactions as TransactionModel[]} />
        <MonthlyComparisonChart transactions={monthlyTransactions as TransactionModel[]} />
      </div>

      <div className="mb-8">
        <BalanceEvolutionChart transactions={monthlyTransactions as TransactionModel[]} />
      </div>

      <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
        <h2 className="text-2xl font-bold mb-6">Transações do Mês</h2>
        <TransactionList
          transactions={monthlyTransactions as TransactionModel[]}
          onDelete={deleteTransaction}
          onEdit={handleEditTransaction}
        />
      </Card>

      {/* Edit Transaction Dialog */}
      {editingTransaction && (
        <EditTransactionForm
          transaction={editingTransaction}
          onSubmit={handleUpdateTransaction}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default Overview;
