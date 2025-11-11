import { useState } from "react";
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
import { Download, Calendar, Filter } from "lucide-react";
import { ReportFilters } from "../services/reports-service";
import { reportsService } from "../services/reports-service";
import { toast } from "sonner";
import { MonthSelector } from "./month-selector";

interface ReportFiltersProps {
  onFiltersChange?: (filters: ReportFilters) => void;
}

export const ReportFiltersComponent = ({
  onFiltersChange,
}: ReportFiltersProps) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [filters, setFilters] = useState<ReportFilters>({
    type: "MONTHLY",
    period: "THIS_YEAR",
  });
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await reportsService.downloadReport(filters);
      toast.success("Relatório baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao baixar o relatório. Tente novamente.");
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getMonthDateRange = (monthString: string) => {
    const [year, month] = monthString.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return {
      dateFrom: startDate.toISOString().split("T")[0],
      dateTo: endDate.toISOString().split("T")[0],
    };
  };

  const getDateRange = () => {
    const now = new Date();
    switch (filters.period) {
      case "SPECIFIC_MONTH": {
        return getMonthDateRange(selectedMonth);
      }
      case "LAST_30_DAYS": {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return {
          dateFrom: thirtyDaysAgo.toISOString().split("T")[0],
          dateTo: now.toISOString().split("T")[0],
        };
      }
      case "LAST_3_MONTHS": {
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return {
          dateFrom: threeMonthsAgo.toISOString().split("T")[0],
          dateTo: now.toISOString().split("T")[0],
        };
      }
      case "LAST_6_MONTHS": {
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return {
          dateFrom: sixMonthsAgo.toISOString().split("T")[0],
          dateTo: now.toISOString().split("T")[0],
        };
      }
      case "LAST_YEAR": {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return {
          dateFrom: oneYearAgo.toISOString().split("T")[0],
          dateTo: now.toISOString().split("T")[0],
        };
      }
      case "THIS_YEAR":
        return {
          dateFrom: new Date(now.getFullYear(), 0, 1)
            .toISOString()
            .split("T")[0],
          dateTo: now.toISOString().split("T")[0],
        };
      case "CUSTOM":
        return {
          dateFrom:
            filters.dateFrom ||
            new Date(now.getFullYear(), now.getMonth(), 1)
              .toISOString()
              .split("T")[0],
          dateTo: filters.dateTo || now.toISOString().split("T")[0],
        };
      default:
        return {
          dateFrom: new Date(now.getFullYear(), now.getMonth(), 1)
            .toISOString()
            .split("T")[0],
          dateTo: now.toISOString().split("T")[0],
        };
    }
  };

  const updateDateRange = () => {
    const dateRange = getDateRange();
    setFilters((prev) => ({
      ...prev,
      ...dateRange,
    }));
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    if (filters.period === "SPECIFIC_MONTH") {
      const dateRange = getMonthDateRange(month);
      const newFilters = { ...filters, ...dateRange };
      setFilters(newFilters);
      onFiltersChange?.(newFilters);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Filter className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Filtros de Relatório</h2>
          <p className="text-sm text-muted-foreground">
            Configure os parâmetros para gerar seu relatório
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Relatório</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MONTHLY">Mensal</SelectItem>
              <SelectItem value="YEARLY">Anual</SelectItem>
              <SelectItem value="CUSTOM">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">Período</Label>
          <Select
            value={filters.period}
            onValueChange={(value) => {
              handleFilterChange("period", value as ReportFilters["period"]);
              updateDateRange();
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SPECIFIC_MONTH">Mês Específico</SelectItem>
              <SelectItem value="LAST_30_DAYS">Últimos 30 dias</SelectItem>
              <SelectItem value="LAST_3_MONTHS">Últimos 3 meses</SelectItem>
              <SelectItem value="LAST_6_MONTHS">Últimos 6 meses</SelectItem>
              <SelectItem value="LAST_YEAR">Último ano</SelectItem>
              <SelectItem value="THIS_YEAR">Este ano</SelectItem>
              <SelectItem value="CUSTOM">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filters.period === "SPECIFIC_MONTH" && (
          <div className="space-y-2">
            <Label>Selecione o Mês</Label>
            <MonthSelector
              selectedMonth={selectedMonth}
              onMonthChange={handleMonthChange}
            />
          </div>
        )}

        {filters.period === "CUSTOM" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Data Inicial</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">Data Final</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Baixando..." : "Baixar Relatório Excel"}
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {filters.period === "CUSTOM"
              ? `${filters.dateFrom || "N/A"} até ${filters.dateTo || "N/A"}`
              : filters.period === "SPECIFIC_MONTH"
              ? `${getDateRange().dateFrom} até ${getDateRange().dateTo}`
              : getDateRange().dateFrom + " até " + getDateRange().dateTo}
          </span>
        </div>
      </div>
    </Card>
  );
};
