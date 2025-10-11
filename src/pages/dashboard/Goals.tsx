import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Goals = () => {
  const goals = [
    {
      id: 1,
      name: "Fundo de Emergência",
      target: 10000,
      current: 6500,
      category: "Reserva",
      deadline: "2025-12-31",
    },
    {
      id: 2,
      name: "Viagem de Férias",
      target: 5000,
      current: 3200,
      category: "Lazer",
      deadline: "2025-07-01",
    },
    {
      id: 3,
      name: "Novo Notebook",
      target: 4000,
      current: 1800,
      category: "Tecnologia",
      deadline: "2025-06-30",
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Metas Financeiras</h1>
        <p className="text-muted-foreground">
          Acompanhe o progresso dos seus objetivos
        </p>
      </div>

      <div className="grid gap-6">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          const remaining = goal.target - goal.current;

          return (
            <Card key={goal.id} className="p-6 bg-gradient-card shadow-soft border-border/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{goal.name}</h3>
                    <Badge variant="secondary">{goal.category}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Prazo</p>
                  <p className="font-medium">
                    {new Date(goal.deadline).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progresso</span>
                    <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Meta</p>
                    <p className="font-bold text-lg">{formatCurrency(goal.target)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Atual</p>
                    <p className="font-bold text-lg text-success">
                      {formatCurrency(goal.current)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Faltam</p>
                    <p className="font-bold text-lg text-destructive">
                      {formatCurrency(remaining)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        <Card className="p-12 bg-gradient-card shadow-soft border-border/50 border-dashed text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Adicione novas metas para acompanhar seus objetivos
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Goals;
