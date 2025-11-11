import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Target } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { useGoalsStore } from "../store/use-goals-store";
import { useToast } from "@/shared/hooks/use-toast";
import { GoalModel } from "../model/goal-model";
import { CurrencyHelper } from "@/shared/helpers/currency-helper";

const addValueSchema = z.object({
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
});

type AddValueFormData = z.infer<typeof addValueSchema>;

interface AddValueDialogProps {
  goal: GoalModel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddValueDialog = ({ goal, open, onOpenChange }: AddValueDialogProps) => {
  const { addValueToGoal } = useGoalsStore();
  const { toast } = useToast();

  const form = useForm<AddValueFormData>({
    resolver: zodResolver(addValueSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = async (data: AddValueFormData) => {
    try {
      await addValueToGoal(goal.id, data.amount);
      
      form.reset();
      onOpenChange(false);
      
      toast({
        title: "Valor adicionado!",
        description: `${CurrencyHelper.formatCurrency(data.amount)} foi adicionado à sua meta.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar valor",
        description: "Ocorreu um erro ao adicionar o valor. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            Adicionar Valor à Meta
          </DialogTitle>
          <DialogDescription>
            Adicione um valor ao progresso da sua meta "{goal.title}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Progress Display */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Progresso Atual</span>
              <span className="text-sm font-bold text-primary">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Atual:</span>
                <span className="ml-2 font-bold text-success">
                  {CurrencyHelper.formatCurrency(goal.currentAmount)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Meta:</span>
                <span className="ml-2 font-bold">
                  {CurrencyHelper.formatCurrency(goal.targetAmount)}
                </span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-muted-foreground">Faltam: </span>
              <span className="font-bold text-destructive">
                {CurrencyHelper.formatCurrency(remaining)}
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor a Adicionar</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="R$ 0,00"
                        value={field.value ? CurrencyHelper.formatCurrency(field.value) : ""}
                        onChange={(e) => {
                          const value = CurrencyHelper.parseCurrency(e.target.value);
                          field.onChange(value);
                        }}
                        className="text-lg font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-primary to-primary/80"
                  disabled={form.watch("amount") <= 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
