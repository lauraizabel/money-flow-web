import { Pencil, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { InvestmentModel } from "../model/investment-model";
import { Badge } from "@/shared/ui/badge";

interface InvestmentListProps {
  investments: InvestmentModel[];
  onEdit: (investment: InvestmentModel) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const InvestmentList = ({
  investments,
  onEdit,
  onDelete,
  isLoading,
}: InvestmentListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (investments.length === 0) {
    return (
      <Card className="p-12 text-center bg-gradient-card shadow-soft border-border/50">
        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">
          Nenhum investimento encontrado
        </h3>
        <p className="text-muted-foreground">
          Comece adicionando seu primeiro investimento
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Preço Unitário</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((investment) => (
            <TableRow key={investment.id}>
              <TableCell className="font-medium">{investment.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{investment.typeLabel}</Badge>
              </TableCell>
              <TableCell>{investment.formattedAmount}</TableCell>
              <TableCell>
                {investment.quantity
                  ? new Intl.NumberFormat("pt-BR").format(investment.quantity)
                  : "-"}
              </TableCell>
              <TableCell>
                {investment.unitPrice
                  ? new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(investment.unitPrice)
                  : "-"}
              </TableCell>
              <TableCell>{investment.formattedDate}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(investment)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(investment.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
