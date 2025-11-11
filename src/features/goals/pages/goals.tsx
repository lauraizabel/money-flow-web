import { Card } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Target, TrendingUp, Plus, Check } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { useGoalsStore } from "../store/use-goals-store";
import { CreateGoalForm } from "../components/create-goal-form";
import { AddValueDialog } from "../components/add-value-dialog";
import { useEffect, useState } from "react";
import { GoalModel } from "../model/goal-model";
import { GoalStatus } from "@/features/transactions/const/goal-status";
import { CurrencyHelper } from "@/shared/helpers/currency-helper";

const Goals = () => {
  const { goals, fetchGoals, setIsLoading } = useGoalsStore();
  const [selectedGoal, setSelectedGoal] = useState<GoalModel | null>(null);
  const [addValueOpen, setAddValueOpen] = useState(false);
  const statusMap = {
    [GoalStatus.ACTIVE]: "Ativo",
    [GoalStatus.COMPLETED]: "Completado",
    [GoalStatus.PAUSED]: "Pausado",
    [GoalStatus.CANCELLED]: "Cancelado",
  };

  const handleAddValue = (goal: GoalModel) => {
    setSelectedGoal(goal);
    setAddValueOpen(true);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchGoals();
    setIsLoading(false);
  }, [fetchGoals, setIsLoading]);

    return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Metas Financeiras</h1>
          <p className="text-muted-foreground">
            Acompanhe o progresso dos seus objetivos
          </p>
        </div>
        <CreateGoalForm />
      </div>

      <div className="grid gap-6">
        {goals.map((goal: GoalModel) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          const goalStatus = statusMap[goal.status as unknown as keyof typeof statusMap];
          return (
            <Card key={goal.id} className="p-6 bg-gradient-card shadow-soft border-border/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{goal.title}</h3>
                    <Badge variant="secondary">{goalStatus}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Prazo</p>
                  <p className="font-medium">
                    {goal.targetDate 
                      ? new Date(goal.targetDate).toLocaleDateString("pt-BR")
                      : "Sem prazo"
                    }
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
                    <p className="font-bold text-lg">{CurrencyHelper.formatCurrency(goal.targetAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Atual</p>
                    <p className="font-bold text-lg text-success">
                      {CurrencyHelper.formatCurrency(goal.currentAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Faltam</p>
                    <p className="font-bold text-lg text-destructive">
                      {CurrencyHelper.formatCurrency(remaining)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                {goal.isCompleted ? (
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                  >
                    <Check className="h-4 w-4 mr-2 text-success-foreground" />
                    Meta concluída
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleAddValue(goal)}
                    variant="outline"
                    size="sm"
                    className="w-full bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 border-primary/20 text-primary hover:text-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Valor
                  </Button>
                )}
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

      {selectedGoal && (
        <AddValueDialog
          goal={selectedGoal}
          open={addValueOpen}
          onOpenChange={setAddValueOpen}
        />
      )}
    </div>
  );
};

export default Goals;
