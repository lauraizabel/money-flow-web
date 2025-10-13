import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useEffect } from "react";

import { Card } from "@/components/ui/card";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionList } from "@/components/TransactionList";
import { FinanceChart } from "@/components/FinanceChart";
import { MonthlyComparisonChart } from "@/components/MonthlyComparisonChart";
import { BalanceEvolutionChart } from "@/components/BalanceEvolutionChart";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { CATEGORY_TYPE } from "@/const/category-type.const";

const Overview = () => {
  const { fetchCategories } = useCategoryStore();
  const { transactions, deleteTransaction, fetchTransactions } = useTransactionStore();

  const totalIncome = transactions?.filter((t) => t.type === CATEGORY_TYPE.INCOME)
    ?.reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    ?.filter((t) => t.type === CATEGORY_TYPE.EXPENSE)
    ?.reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchCategories(),
        fetchTransactions()
      ]);
    };
    loadData();
  }, [fetchCategories, fetchTransactions]);


  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Balance Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <BalanceCard
          title="Saldo Total"
          amount={balance}
          icon={Wallet}
          variant={balance >= 0 ? "success" : "destructive"}
        />
        <BalanceCard
          title="Receitas"
          amount={totalIncome}
          icon={TrendingUp}
          variant="success"
        />
        <BalanceCard
          title="Despesas"
          amount={totalExpense}
          icon={TrendingDown}
          variant="destructive"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <FinanceChart transactions={transactions} />
        <MonthlyComparisonChart transactions={transactions} />
      </div>

      <div className="mb-8">
        <BalanceEvolutionChart transactions={transactions} />
      </div>

      {/* Transactions List */}
      <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
        <h2 className="text-2xl font-bold mb-6">Transações Recentes</h2>
        <TransactionList
          transactions={transactions?.slice(0, 10)}
          onDelete={deleteTransaction}
        />
      </Card>
    </div>
  );
};

export default Overview;
