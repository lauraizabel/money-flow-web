import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
  Trash2,
} from "lucide-react";
import { TransactionForm } from "@/components/TransactionForm";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionList } from "@/components/TransactionList";
import { FinanceChart } from "@/components/FinanceChart";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "income",
      amount: 3500,
      description: "Salário",
      date: "2025-01-05",
    },
    {
      id: "2",
      type: "expense",
      amount: 150,
      description: "Supermercado",
      date: "2025-01-06",
    },
    {
      id: "3",
      type: "expense",
      amount: 80,
      description: "Internet",
      date: "2025-01-07",
    },
  ]);
  const [showForm, setShowForm] = useState(false);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
    setShowForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                FinanceFlow
              </span>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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
            onDelete={handleDeleteTransaction}
          />
        </Card>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          onSubmit={handleAddTransaction}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
