import api from "@/shared/api/axios"

export interface InvoiceProjectionItem {
  month: string
  amount: number
}

export interface InvoiceImportSummary {
  createdCount: number
  skippedCount: number
}

export interface InvoiceProjectionResponse {
  currentDue: {
    amount: number
    dueDate: string
  }
  projection: {
    byMonth: InvoiceProjectionItem[]
    totalRemaining: number
  }
  source: {
    provider: string
    rawConfidence: number
    warnings?: string[]
  }
  import?: InvoiceImportSummary
}

export const invoicesService = {
  uploadInvoicePdf: async (
    file: File,
    categoryId?: string
  ): Promise<InvoiceProjectionResponse> => {
    const formData = new FormData()
    formData.append("file", file)
    if (categoryId) {
      formData.append("categoryId", categoryId)
    }

    const response = await api.post<InvoiceProjectionResponse>(
      "/faturas/projecao",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    return response.data
  },
}

