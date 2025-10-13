import { Card } from "@/components/ui/card";
import { TransactionModel } from "@/model/transaction-model";
import { formatDateForChart } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BalanceEvolutionChartProps {
  transactions: TransactionModel[];
}

export const BalanceEvolutionChart = ({
  transactions,
}: BalanceEvolutionChartProps) => {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let runningBalance = 0;
  const data = sortedTransactions.map((t) => {
    if (t.isIncome) {
      runningBalance += t.amount;
    } else {
      runningBalance -= t.amount;
    }

    return {
      date: formatDateForChart(t.date.toISOString(), {
        day: "2-digit",
        month: "short",
      }),
      saldo: runningBalance,
    };
  });

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
        <h2 className="text-2xl font-bold mb-6">Evolução do Saldo</h2>
        <div className="text-center py-12 text-muted-foreground">
          <p>Adicione transações para visualizar a evolução.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
      <h2 className="text-2xl font-bold mb-6">Evolução do Saldo</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" stroke="hsl(var(--foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
          <Tooltip
            formatter={(value) => formatCurrency(value as number)}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="saldo"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
