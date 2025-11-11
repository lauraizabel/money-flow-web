import { Investment, InvestmentType } from "@/shared/types/investment";

export class InvestmentModel {
  id: string;
  name: string;
  type: InvestmentType;
  amount: number;
  quantity?: number;
  unitPrice?: number;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Investment) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.amount = data.amount;
    this.quantity = data.quantity;
    this.unitPrice = data.unitPrice;
    this.date = new Date(data.date);
    this.description = data.description;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
  }

  static fromApi(data: Investment) {
    return new InvestmentModel(data);
  }

  get formattedAmount(): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(this.amount);
  }

  get formattedDate(): string {
    return new Intl.DateTimeFormat("pt-BR").format(this.date);
  }

  get typeLabel(): string {
    const labels: Record<InvestmentType, string> = {
      [InvestmentType.STOCK]: "Ação",
      [InvestmentType.FUND]: "Fundo",
      [InvestmentType.FIXED_INCOME]: "Renda Fixa",
      [InvestmentType.CRYPTO]: "Criptomoeda",
      [InvestmentType.OTHER]: "Outro",
    };
    return labels[this.type] || "Outro";
  }
}
