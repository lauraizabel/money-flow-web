import { useOutletContext } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface DashboardContext {
  transactions: Transaction[];
}

const Categories = () => {
  const { transactions } = useOutletContext<DashboardContext>();

  const expenses = transactions.filter((t) => t.type === "expense");

  const categoryData = expenses.reduce((acc, transaction) => {
    const categoryName = transaction.category?.name || 'Sem categoria';
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  const barData = Object.entries(categoryData).map(([name, value]) => ({
    category: name,
    total: value,
  }));

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--success))",
    "hsl(var(--destructive))",
    "hsl(var(--accent))",
    "#8B5CF6",
    "#F59E0B",
    "#10B981",
    "#EF4444",
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Análise de Categorias</h1>
        <p className="text-muted-foreground">
          Visualize seus gastos organizados por categoria
        </p>
      </div>

      {expenses.length === 0 ? (
        <Card className="p-12 bg-gradient-card shadow-soft border-border/50 text-center">
          <p className="text-muted-foreground">
            Adicione despesas para visualizar a análise por categorias.
          </p>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Gráfico de Pizza */}
          <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
            <h2 className="text-2xl font-bold mb-6">Distribuição por Categoria</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico de Barras */}
          <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
            <h2 className="text-2xl font-bold mb-6">Total por Categoria</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="category"
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Lista de Categorias */}
          <Card className="lg:col-span-2 p-6 bg-gradient-card shadow-soft border-border/50">
            <h2 className="text-2xl font-bold mb-6">Resumo de Gastos</h2>
            <div className="space-y-4">
              {Object.entries(categoryData)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount], index) => {
                  const percentage = (amount / totalExpenses) * 100;
                  return (
                    <div
                      key={category}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:shadow-soft transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <div>
                          <p className="font-medium">{category}</p>
                          <p className="text-sm text-muted-foreground">
                            {percentage.toFixed(1)}% do total
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-lg text-destructive">
                        {formatCurrency(amount)}
                      </p>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Categories;
