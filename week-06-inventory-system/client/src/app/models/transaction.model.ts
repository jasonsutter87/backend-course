export interface Transaction {
  id: number;
  productId: number;
  quantity: number;
  type: 'In' | 'Out';
  timestamp: string;
}
