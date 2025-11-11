import { create } from "zustand";
import { FullReport, ReportFilters, reportsService } from "../services/reports-service";

export interface ReportStore {
  report: FullReport | undefined;
  setReport: (report: FullReport) => void;
  fetchReport: (filters: ReportFilters) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}


export const useReportStore = create<ReportStore>((set) => ({
  report: undefined,
  isLoading: false,
  setReport: (report) => set({ report }),
  setIsLoading: (isLoading) => set({ isLoading }),
  fetchReport: async (filters: ReportFilters) => {
    set({ isLoading: true });
    const report = await reportsService.getFullReport(filters);
    set({ report });
    set({ isLoading: false });
  },
})); 