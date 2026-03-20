export enum TicketStatus {
  Open = 0,
  InProgress = 1,
  Resolved = 2,
  Closed = 3
}

export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDto {
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  assignedTo?: string | null;
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  [TicketStatus.Open]: 'Open',
  [TicketStatus.InProgress]: 'In Progress',
  [TicketStatus.Resolved]: 'Resolved',
  [TicketStatus.Closed]: 'Closed'
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  [Priority.Low]: 'Low',
  [Priority.Medium]: 'Medium',
  [Priority.High]: 'High',
  [Priority.Critical]: 'Critical'
};
