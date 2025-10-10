import { Card } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface FinanceChartProps {
  transactions: Transaction[];
}

export const FinanceChart = ({ transactions }: FinanceChartProps) => {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const data = [
    { name: "Receitas", value: totalIncome, color: "hsl(var(--success))" },
    { name: "Despesas", value: totalExpense, color: "hsl(var(--destructive))" },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (totalIncome === 0 && totalExpense === 0) {
    return (
      <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
        <h2 className="text-2xl font-bold mb-6">Visão Geral</h2>
        <div className="text-center py-12 text-muted-foreground">
          <p>Adicione transações para visualizar o gráfico.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
      <h2 className="text-2xl font-bold mb-6">Visão Geral</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value as number)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
