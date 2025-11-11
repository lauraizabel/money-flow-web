import api from "@/shared/api/axios";
import { TransactionModel } from "@/shared/model/transaction.model";
import { Transaction } from "@/shared/types/transaction";

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  averageIncome: number;
  averageExpense: number;
  biggestIncome: number;
  biggestExpense: number;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlySummary {
  month: string;
  year: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface ReportFilters {
  type?: "MONTHLY" | "YEARLY" | "CUSTOM";
  period?:
    | "SPECIFIC_MONTH"
    | "LAST_30_DAYS"
    | "LAST_3_MONTHS"
    | "LAST_6_MONTHS"
    | "LAST_YEAR"
    | "THIS_YEAR"
    | "CUSTOM";
  dateFrom?: string;
  dateTo?: string;
}

export interface FullReport {
  summary: FinancialSummary;
  categoryBreakdown: CategorySummary[];
  monthlyTrend: MonthlySummary[];
  transactions: TransactionModel[] | Transaction[];
  period: {
    from: string;
    to: string;
  };
}

export const reportsService = {
  getFullReport: async (filters: ReportFilters = {}): Promise<FullReport> => {
    const params = new URLSearchParams();

    if (filters.type) params.append("type", filters.type);
    if (filters.period) params.append("period", filters.period);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);

    const response = await api.get<FullReport>(
      `/reports/financial?${params.toString()}`
    );
    return reportsService.formatRespose(response.data);
  },

  formatRespose: (response: FullReport) => {
    return {
      ...response,
      transactions: response.transactions.map(
        (transaction: TransactionModel | Transaction) =>
          transaction instanceof TransactionModel
            ? transaction
            : TransactionModel.fromApi(transaction)
      ),
    };
  },

  downloadReport: async (
    filters: ReportFilters = {},
    customFilename?: string
  ): Promise<void> => {
    const params = new URLSearchParams();

    if (filters.type) params.append("type", filters.type);
    if (filters.period) params.append("period", filters.period);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);

    const response = await api.get(
      `/reports/download-report?${params.toString()}`,
      {
        responseType: "blob",
      }
    );

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Generate filename
    let filename: string;
    if (customFilename) {
      filename = customFilename;
    } else {
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      filename = `relatorio-financeiro-${dateStr}.xlsx`;
    }
    link.setAttribute("download", filename);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
