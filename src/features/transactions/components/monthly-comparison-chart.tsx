import { Card } from "@/shared/ui/card";
import { TransactionModel } from "@/shared/model/transaction.model";
import { formatDateForChart } from "@/shared/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyComparisonChartProps {
  transactions: TransactionModel[];
}

export const MonthlyComparisonChart = ({
  transactions,
}: MonthlyComparisonChartProps) => {
  const monthlyData = transactions.reduce((acc, t) => {
    const month = formatDateForChart(t.date.toISOString(), {
      month: "short",
      year: "numeric",
    });

    if (!acc[month]) {
      acc[month] = { month, receitas: 0, despesas: 0 };
    }

    if (t.isIncome) {
      acc[month].receitas += t.amount;
    } else {
      acc[month].despesas += t.amount;
    }

    return acc;
  }, {} as Record<string, { month: string; receitas: number; despesas: number }>);

  const data = Object.values(monthlyData).slice(-6);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (data.length === 0) {
    return (
      <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
        <h2 className="text-2xl font-bold mb-6">Comparativo Mensal</h2>
        <div className="text-center py-12 text-muted-foreground">
          <p>Adicione transações para visualizar o comparativo.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
      <h2 className="text-2xl font-bold mb-6">Comparativo Mensal</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
          <Tooltip
            formatter={(value) => formatCurrency(value as number)}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar dataKey="receitas" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
          <Bar dataKey="despesas" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
