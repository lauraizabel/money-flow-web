import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Calendar, FileUp, Loader2, Wallet } from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { CurrencyHelper } from "@/shared/helpers/currency-helper";
import {
  invoicesService,
  InvoiceProjectionResponse,
} from "@/features/invoices/services/invoices-service";
import { categoriesService } from "@/features/categories/services/categories-service";
import { CategoryModel } from "@/shared/model/category.model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

const formatMonthLabel = (value: string): string => {
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return value;
  return new Date(year, month - 1, 1).toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  });
};

const AUTO_CATEGORY_VALUE = "__auto__";

const Invoices = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<InvoiceProjectionResponse | null>(null);
  const [expenseCategories, setExpenseCategories] = useState<CategoryModel[]>(
    [],
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const list = await categoriesService.getCategories();
        setExpenseCategories(list.filter((c) => c.isExpense));
      } catch {
        toast.error("Não foi possível carregar as categorias");
      }
    };
    void loadCategories();
  }, []);

  const projectionData = useMemo(
    () =>
      (result?.projection.byMonth || []).map((item) => ({
        ...item,
        monthLabel: formatMonthLabel(item.month),
      })),
    [result],
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Selecione um arquivo PDF da fatura");
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      toast.error("O arquivo precisa ser um PDF");
      return;
    }

    try {
      setIsLoading(true);
      const response = await invoicesService.uploadInvoicePdf(
        selectedFile,
        selectedCategoryId,
      );
      setResult(response);
      const created = response.import?.createdCount ?? 0;
      const skipped = response.import?.skippedCount ?? 0;
      toast.success(
        `Fatura processada: ${created} lançamento(s) criado(s), ${skipped} ignorado(s) (duplicados)`,
      );
    } catch (error) {
      setResult(null);
      toast.error("Não foi possível processar a fatura");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Faturas</h1>
        <p className="text-muted-foreground">
          Envie seu PDF para ver o valor atual e a projeção dos próximos meses.
          Os lançamentos entram na categoria{" "}
          <span className="font-medium text-foreground">Cartão de crédito</span>{" "}
          (criada automaticamente se precisar); você pode trocar a categoria
          depois em{" "}
          <span className="font-medium text-foreground">Transações</span>.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Selecione a fatura (PDF)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="invoice-category"
              className="text-sm font-medium text-muted-foreground mb-2 block"
            >
              Categoria (opcional)
            </label>
            <Select
              value={selectedCategoryId ?? AUTO_CATEGORY_VALUE}
              onValueChange={(value) =>
                setSelectedCategoryId(
                  value === AUTO_CATEGORY_VALUE ? undefined : value,
                )
              }
            >
              <SelectTrigger
                id="invoice-category"
                aria-label="Categoria para lançamentos da fatura"
              >
                <SelectValue placeholder="Cartão de crédito (padrão)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AUTO_CATEGORY_VALUE}>
                  Cartão de crédito (padrão)
                </SelectItem>
                {expenseCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              Outra categoria só se quiser agrupar diferente; depois dá para
              editar cada lançamento.
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="min-w-44"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4" />
                Processar Fatura
              </>
            )}
          </Button>
        </div>
      </Card>

      {result && (
        <>
          {result.import !== undefined && (
            <Card className="p-4 shadow-medium border-border/50">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Importação:{" "}
                </span>
                {result.import.createdCount} lançamento(s) criado(s),{" "}
                {result.import.skippedCount} ignorado(s) por já existirem (mesma
                fatura / parcela e mês).
              </p>
            </Card>
          )}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 shadow-medium border-border/50">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Devo agora</p>
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold">
                {CurrencyHelper.formatCurrency(result.currentDue.amount)}
              </p>
            </Card>

            <Card className="p-6 shadow-medium border-border/50">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Vencimento atual
                </p>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold">
                {new Date(
                  `${result.currentDue.dueDate}T00:00:00`,
                ).toLocaleDateString("pt-BR")}
              </p>
            </Card>

            <Card className="p-6 shadow-medium border-border/50">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">Total futuro</p>
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold">
                {CurrencyHelper.formatCurrency(
                  result.projection.totalRemaining,
                )}
              </p>
            </Card>
          </div>

          <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
            <h2 className="text-2xl font-bold mb-6">Projeção por mês</h2>
            {projectionData.length === 0 ? (
              <p className="text-muted-foreground">
                Não foi possível identificar parcelas futuras nesta fatura.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={projectionData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="monthLabel"
                    stroke="hsl(var(--foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                  <Tooltip
                    formatter={(value) =>
                      CurrencyHelper.formatCurrency(value as number)
                    }
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          {result.source.warnings && result.source.warnings.length > 0 && (
            <Card className="p-4 border-yellow-500/30 bg-yellow-500/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">
                    Atenção na leitura da fatura
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {result.source.warnings.map((warning) => (
                      <li key={warning}>- {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Invoices;
