import { useOutletContext } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { TransactionModel } from "@/model/transaction-model";
import { MonthlyComparisonChart } from "@/components/MonthlyComparisonChart";
import { BalanceEvolutionChart } from "@/components/BalanceEvolutionChart";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { BalanceCard } from "@/components/BalanceCard";

interface DashboardContext {
  transactions: TransactionModel[];
}

const Reports = () => {
  const { transactions } = useOutletContext<DashboardContext>();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthTransactions = transactions.filter((t) => {
    const date = t.date;
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalIncome = currentMonthTransactions
    .filter((t) => t.isIncome)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter((t) => t.isExpense)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
        <p className="text-muted-foreground">
          Análise detalhada das suas finanças
        </p>
      </div>

      {/* Resumo do Mês */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <BalanceCard
          title="Saldo do Mês"
          amount={balance}
          icon={Wallet}
          variant={balance >= 0 ? "success" : "destructive"}
        />
        <BalanceCard
          title="Receitas do Mês"
          amount={totalIncome}
          icon={TrendingUp}
          variant="success"
        />
        <BalanceCard
          title="Despesas do Mês"
          amount={totalExpense}
          icon={TrendingDown}
          variant="destructive"
        />
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <MonthlyComparisonChart transactions={transactions} />
        <BalanceEvolutionChart transactions={transactions} />
      </div>

      {/* Top Categorias */}
      <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
        <h2 className="text-2xl font-bold mb-6">Top Categorias de Despesa</h2>
        <div className="space-y-4">
          {Object.entries(
            currentMonthTransactions
              .filter((t) => t.isExpense)
              .reduce((acc, t) => {
                const categoryName = t.category?.name || 'Sem categoria';
                if (!acc[categoryName]) {
                  acc[categoryName] = 0;
                }
                acc[categoryName] += t.amount;
                return acc;
              }, {} as Record<string, number>)
          )
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([category, amount]) => (
              <div
                key={category}
                className="flex justify-between items-center p-4 rounded-lg border border-border/50 bg-card"
              >
                <span className="font-medium">{category}</span>
                <span className="text-lg font-bold text-destructive">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(amount)}
                </span>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
