import { useOutletContext } from "react-router-dom";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionList } from "@/components/TransactionList";
import { FinanceChart } from "@/components/FinanceChart";
import { Transaction } from "@/types/transaction";

interface DashboardContext {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const Overview = () => {
  const { transactions, onDeleteTransaction } =
    useOutletContext<DashboardContext>();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

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

      {/* Chart */}
      <div className="mb-8">
        <FinanceChart transactions={transactions} />
      </div>

      {/* Transactions List */}
      <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
        <h2 className="text-2xl font-bold mb-6">Transações Recentes</h2>
        <TransactionList
          transactions={transactions}
          onDelete={onDeleteTransaction}
        />
      </Card>
    </div>
  );
};

export default Overview;
