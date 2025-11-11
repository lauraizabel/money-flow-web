import { useOutletContext } from "react-router-dom";
import { Card } from "@/shared/ui/card";
import { TransactionModel } from "@/shared/model/transaction.model";
import { MonthlyComparisonChart } from "@/features/transactions/components/monthly-comparison-chart";
import { BalanceEvolutionChart } from "@/features/transactions/components/balance-evolution-chart";
import { ReportFiltersComponent } from "@/features/transactions/components/report-filters";
import { MonthSelector } from "@/features/transactions/components/month-selector";
import { TrendingDown, TrendingUp, Wallet, Download } from "lucide-react";
import { BalanceCard } from "@/shared/components/balance-card";
import { Button } from "@/shared/ui/button";
import { useState } from "react";
import { reportsService } from "@/features/transactions/services/reports-service";
import { toast } from "sonner";

interface DashboardContext {
  transactions: TransactionModel[];
}

const Reports = () => {
  const { transactions } = useOutletContext<DashboardContext>();
  const [showFilters, setShowFilters] = useState(false);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [isDownloadingMonth, setIsDownloadingMonth] = useState(false);

  const getMonthDateRange = (monthString: string) => {
    const [year, month] = monthString.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return {
      dateFrom: startDate.toISOString().split("T")[0],
      dateTo: endDate.toISOString().split("T")[0],
    };
  };

  const handleDownloadMonth = async () => {
    try {
      setIsDownloadingMonth(true);
      const dateRange = getMonthDateRange(selectedMonth);
      const [year, month] = selectedMonth.split("-");
      const monthName = new Date(
        parseInt(year),
        parseInt(month) - 1
      ).toLocaleDateString("pt-BR", { month: "long" });
      const filename = `relatorio-financeiro-${monthName}-${year}.xlsx`;

      await reportsService.downloadReport(
        {
          type: "MONTHLY",
          period: "CUSTOM",
          ...dateRange,
        },
        filename
      );

      toast.success(`Relatório de ${monthName}/${year} baixado com sucesso!`);
    } catch (error) {
      toast.error("Erro ao baixar o relatório. Tente novamente.");
      console.error("Download error:", error);
    } finally {
      setIsDownloadingMonth(false);
    }
  };

  const currentMonthTransactions = transactions.filter((t) => {
    const transactionMonth = new Date(t.date).toISOString().slice(0, 7);
    return transactionMonth === selectedMonth;
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
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
            <p className="text-muted-foreground">
              Análise detalhada das suas finanças
            </p>
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 border-primary/20 text-primary hover:text-primary"
          >
            <Download className="h-4 w-4 mr-2" />
            {showFilters ? "Ocultar Filtros" : "Filtros Avançados"}
          </Button>
        </div>

        {/* Seletor de Mês e Download Rápido */}
        <Card className="p-4 bg-gradient-card shadow-soft border-border/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Baixar Relatório do Mês:
                </label>
                <MonthSelector
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                />
              </div>
            </div>
            <Button
              onClick={handleDownloadMonth}
              disabled={isDownloadingMonth}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloadingMonth ? "Baixando..." : "Baixar Relatório do Mês"}
            </Button>
          </div>
        </Card>
      </div>

      {/* Filtros de Download */}
      {showFilters && (
        <div className="mb-8">
          <ReportFiltersComponent />
        </div>
      )}

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
                const categoryName = t.category?.name || "Sem categoria";
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
