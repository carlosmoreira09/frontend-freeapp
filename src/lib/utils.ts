import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number | undefined) => {
  if(!amount) return
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Hoje';
  } else if (diffDays === 1) {
    return 'Ontem';
  } else {
    return date.toLocaleDateString('pt-BR');
  }
};

export const getActivityStatusClass = (type: string, transactionType?: string): string => {
  if (type === 'registration') {
    return 'bg-green-100 text-green-800';
  } else if (type === 'transaction') {
    return transactionType === 'income' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  } else {
    return 'bg-blue-100 text-blue-800';
  }
};