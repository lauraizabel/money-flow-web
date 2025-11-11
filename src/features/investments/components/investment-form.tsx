import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { InvestmentType } from "@/shared/types/investment";
import { CreateInvestmentDto } from "../dto/create-investment.dto";
import { UpdateInvestmentDto } from "../dto/update-investment.dto";
import { CurrencyHelper } from "@/shared/helpers/currency-helper";

const investmentSchema = z
  .object({
    name: z
      .string({
        required_error: "Nome é obrigatório",
        invalid_type_error: "Nome deve ser um texto",
      })
      .min(1, "Nome é obrigatório")
      .max(100, "Nome deve ter no máximo 100 caracteres"),
    type: z.nativeEnum(InvestmentType, {
      required_error: "Tipo é obrigatório",
      invalid_type_error: "Tipo inválido",
    }),
    amount: z
      .number({
        required_error: "Valor é obrigatório",
        invalid_type_error: "Valor deve ser um número",
      })
      .min(0.01, "Valor deve ser maior que zero")
      .positive("Valor deve ser positivo"),
    quantity: z.preprocess(
      (val) =>
        (typeof val === "number" && isNaN(val)) || val === "" ? undefined : val,
      z
        .number({
          invalid_type_error: "Quantidade deve ser um número",
        })
        .positive("Quantidade deve ser positiva")
        .optional()
    ),
    unitPrice: z.preprocess(
      (val) =>
        (typeof val === "number" && isNaN(val)) || val === "" ? undefined : val,
      z
        .number({
          invalid_type_error: "Preço unitário deve ser um número",
        })
        .positive("Preço unitário deve ser positivo")
        .optional()
    ),
    date: z
      .string({
        required_error: "Data é obrigatória",
        invalid_type_error: "Data deve ser uma string",
      })
      .min(1, "Data é obrigatória"),
    description: z
      .string({
        invalid_type_error: "Descrição deve ser um texto",
      })
      .max(500, "Descrição deve ter no máximo 500 caracteres")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.quantity && data.unitPrice && data.amount) {
        const calculatedAmount = data.quantity * data.unitPrice;
        const difference = Math.abs(data.amount - calculatedAmount);
        return difference < 0.01;
      }
      return true;
    },
    {
      message: "O valor total deve ser igual à quantidade × preço unitário",
      path: ["amount"],
    }
  );

type InvestmentFormData = z.infer<typeof investmentSchema>;

interface InvestmentFormProps {
  onSubmit: (investment: CreateInvestmentDto | UpdateInvestmentDto) => void;
  onCancel: () => void;
  initialData?: CreateInvestmentDto | UpdateInvestmentDto;
  isEditing?: boolean;
}

export const InvestmentForm = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: InvestmentFormProps) => {
  const [amountDisplay, setAmountDisplay] = useState(
    initialData?.amount
      ? CurrencyHelper.formatCurrency(initialData.amount)
      : CurrencyHelper.formatCurrency(0)
  );
  const [unitPriceDisplay, setUnitPriceDisplay] = useState(
    initialData?.unitPrice
      ? CurrencyHelper.formatCurrency(initialData.unitPrice)
      : ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          amount: initialData.amount || 0,
        }
      : {
          name: "",
          type: InvestmentType.STOCK,
          amount: 0,
          date: new Date().toISOString().split("T")[0],
        },
  });

  // Atualizar displays quando initialData mudar (edição)
  useEffect(() => {
    if (initialData) {
      if (initialData.amount) {
        setAmountDisplay(CurrencyHelper.formatCurrency(initialData.amount));
      }
      if (initialData.unitPrice) {
        setUnitPriceDisplay(
          CurrencyHelper.formatCurrency(initialData.unitPrice)
        );
      }
    }
  }, [initialData]);

  const type = watch("type");
  const quantity = watch("quantity");
  const unitPrice = watch("unitPrice");

  // Atualizar amount quando quantity ou unitPrice mudarem
  useEffect(() => {
    if (quantity && unitPrice) {
      const calculatedAmount = quantity * unitPrice;
      setValue("amount", calculatedAmount, { shouldValidate: true });
      setAmountDisplay(CurrencyHelper.formatCurrency(calculatedAmount));
    }
  }, [quantity, unitPrice, setValue]);

  const handleFormSubmit = (data: InvestmentFormData) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-2xl p-6 bg-gradient-card shadow-strong border-border/50 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {isEditing ? "Editar Investimento" : "Novo Investimento"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Investimento *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ex: PETR4, ITUB4, etc."
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={type}
                onValueChange={(value) =>
                  setValue("type", value as InvestmentType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={InvestmentType.STOCK}>Ação</SelectItem>
                  <SelectItem value={InvestmentType.FUND}>Fundo</SelectItem>
                  <SelectItem value={InvestmentType.FIXED_INCOME}>
                    Renda Fixa
                  </SelectItem>
                  <SelectItem value={InvestmentType.CRYPTO}>
                    Criptomoeda
                  </SelectItem>
                  <SelectItem value={InvestmentType.OTHER}>Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor Total (R$) *</Label>
              <Input
                id="amount"
                placeholder="R$ 0,00"
                value={amountDisplay}
                onChange={(e) => {
                  const formatted = CurrencyHelper.formatCurrency(
                    CurrencyHelper.parseCurrency(e.target.value)
                  );
                  setAmountDisplay(formatted);
                  setValue(
                    "amount",
                    CurrencyHelper.parseCurrency(e.target.value),
                    {
                      shouldValidate: true,
                    }
                  );
                }}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                {...register("quantity", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Preço Unitário (R$)</Label>
              <Input
                id="unitPrice"
                placeholder="R$ 0,00"
                value={unitPriceDisplay}
                onChange={(e) => {
                  const formatted = CurrencyHelper.formatCurrency(
                    CurrencyHelper.parseCurrency(e.target.value)
                  );
                  setUnitPriceDisplay(formatted);
                  const parsedValue = CurrencyHelper.parseCurrency(
                    e.target.value
                  );
                  setValue("unitPrice", parsedValue, { shouldValidate: true });
                }}
              />
              {errors.unitPrice && (
                <p className="text-sm text-destructive">
                  {errors.unitPrice.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data *</Label>
            <Input id="date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Observações sobre o investimento..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Atualizar" : "Criar"} Investimento
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
