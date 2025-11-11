import { useEffect, useState } from "react";
import { Plus, TrendingUp } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { useInvestmentsStore } from "../store/use-investments-store";
import { InvestmentForm } from "../components/investment-form";
import { InvestmentList } from "../components/investment-list";
import { InvestmentModel } from "../model/investment-model";
import { CreateInvestmentDto } from "../dto/create-investment.dto";
import { UpdateInvestmentDto } from "../dto/update-investment.dto";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

const Investments = () => {
  const {
    investments,
    isLoading,
    fetchInvestments,
    createInvestment,
    updateInvestment,
    deleteInvestment,
  } = useInvestmentsStore();

  const [showForm, setShowForm] = useState(false);
  const [editingInvestment, setEditingInvestment] =
    useState<InvestmentModel | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const handleCreate = async (data: CreateInvestmentDto) => {
    try {
      await createInvestment(data);
      setShowForm(false);
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleUpdate = async (data: UpdateInvestmentDto) => {
    if (!editingInvestment) return;
    try {
      await updateInvestment(editingInvestment.id, data);
      setEditingInvestment(null);
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteInvestment(deletingId);
      setDeletingId(null);
    } catch (error) {
      // Error is handled in the store
    }
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Investimentos</h1>
          <p className="text-muted-foreground">
            Gerencie seus investimentos e acompanhe seu patrimônio
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Investimento
        </Button>
      </div>

      {/* Resumo */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Investido</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalInvested)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total de Investimentos
              </p>
              <p className="text-2xl font-bold">{investments.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Média por Investimento
              </p>
              <p className="text-2xl font-bold">
                {investments.length > 0
                  ? new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(totalInvested / investments.length)
                  : "R$ 0,00"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de Investimentos */}
      <InvestmentList
        investments={investments}
        onEdit={(investment) => setEditingInvestment(investment)}
        onDelete={(id) => setDeletingId(id)}
        isLoading={isLoading}
      />

      {/* Formulário de Criação */}
      {showForm && (
        <InvestmentForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Formulário de Edição */}
      {editingInvestment && (
        <InvestmentForm
          onSubmit={handleUpdate}
          onCancel={() => setEditingInvestment(null)}
          initialData={{
            name: editingInvestment.name,
            type: editingInvestment.type,
            amount: editingInvestment.amount,
            quantity: editingInvestment.quantity,
            unitPrice: editingInvestment.unitPrice,
            date: editingInvestment.date.toISOString().split("T")[0],
            description: editingInvestment.description,
          }}
          isEditing={true}
        />
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este investimento? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Investments;
