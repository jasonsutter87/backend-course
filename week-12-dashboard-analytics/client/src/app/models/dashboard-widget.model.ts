export interface DashboardWidget {
  id: number;
  title: string;
  type: string;  // 'Chart' | 'Table' | 'Counter' | 'List'
  dataSource: string;
  config: string; // JSON string
}

export interface CreateWidgetDto {
  title: string;
  type: string;
  dataSource: string;
  config: string;
}
