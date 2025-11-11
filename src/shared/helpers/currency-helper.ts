export class CurrencyHelper {
  static formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  }

  static parseCurrency(value: string): number {
    const numericValue = value.replace(/\D/g, "");
    return parseInt(numericValue) / 100;
  }
}