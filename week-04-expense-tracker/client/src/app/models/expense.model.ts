export interface Category {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  amount: number;
  description: string;
  categoryId: number;
  category?: Category;
  date: string;
  createdAt: string;
}

export interface CreateExpense {
  amount: number;
  description: string;
  categoryId: number;
  date: string;
}

export interface MonthlyReport {
  year: number;
  month: number;
  total: number;
  count: number;
  expenses: Expense[];
}

export interface CategoryReport {
  categoryId: number;
  categoryName: string;
  total: number;
  count: number;
}
