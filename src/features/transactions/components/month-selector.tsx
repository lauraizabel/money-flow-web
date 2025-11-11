import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export const MonthSelector = ({ selectedMonth, onMonthChange }: MonthSelectorProps) => {
  const formatMonth = (monthString: string) => {
    const date = new Date(monthString + '-01');
    return date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const [year, month] = selectedMonth.split('-').map(Number);
    
    let newYear = year;
    let newMonth = month;
    
    if (direction === 'prev') {
      newMonth = month - 1;
      if (newMonth < 1) {
        newMonth = 12;
        newYear = year - 1;
      }
    } else {
      newMonth = month + 1;
      if (newMonth > 12) {
        newMonth = 1;
        newYear = year + 1;
      }
    }
    
    const newMonthString = `${newYear}-${newMonth.toString().padStart(2, '0')}`;
    onMonthChange(newMonthString);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateMonth('prev')}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="min-w-[120px] text-center">
        <span className="text-sm font-medium">
          {formatMonth(selectedMonth)}
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateMonth('next')}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
