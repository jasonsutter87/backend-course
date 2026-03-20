export interface DataPoint {
  id: number;
  label: string;
  value: number;
  category: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalDataPoints: number;
  total?: number;
  average?: number;
  min?: number;
  max?: number;
}
