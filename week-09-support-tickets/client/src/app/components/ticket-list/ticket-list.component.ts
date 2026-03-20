import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, NgClass, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket, TicketStatus, Priority, STATUS_LABELS, PRIORITY_LABELS } from '../../models/ticket.model';

interface KanbanColumn {
  status: TicketStatus;
  label: string;
  tickets: Ticket[];
}

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, NgClass, SlicePipe, FormsModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent implements OnInit {
  private readonly ticketService = inject(TicketService);

  tickets = signal<Ticket[]>([]);
  loading = signal(true);
  error = signal('');
  priorityFilter = signal<string>('all');
  searchTerm = signal('');

  readonly TicketStatus = TicketStatus;
  readonly Priority = Priority;
  readonly STATUS_LABELS = STATUS_LABELS;
  readonly PRIORITY_LABELS = PRIORITY_LABELS;

  filteredTickets = computed(() => {
    let list = this.tickets();
    const pf = this.priorityFilter();
    const term = this.searchTerm().toLowerCase();
    if (pf !== 'all') list = list.filter(t => t.priority === +pf);
    if (term) list = list.filter(t =>
      t.title.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term) ||
      (t.assignedTo ?? '').toLowerCase().includes(term)
    );
    return list;
  });

  kanbanColumns = computed<KanbanColumn[]>(() => {
    const all = this.filteredTickets();
    return [
      { status: TicketStatus.Open, label: STATUS_LABELS[TicketStatus.Open], tickets: all.filter(t => t.status === TicketStatus.Open) },
      { status: TicketStatus.InProgress, label: STATUS_LABELS[TicketStatus.InProgress], tickets: all.filter(t => t.status === TicketStatus.InProgress) },
      { status: TicketStatus.Resolved, label: STATUS_LABELS[TicketStatus.Resolved], tickets: all.filter(t => t.status === TicketStatus.Resolved) },
      { status: TicketStatus.Closed, label: STATUS_LABELS[TicketStatus.Closed], tickets: all.filter(t => t.status === TicketStatus.Closed) },
    ];
  });

  ngOnInit(): void {
    this.ticketService.getAll().subscribe({
      next: (data) => { this.tickets.set(data); this.loading.set(false); },
      error: () => { this.error.set('Failed to load tickets. Is the server running?'); this.loading.set(false); }
    });
  }

  priorityClass(priority: Priority): string {
    return ['priority-low', 'priority-medium', 'priority-high', 'priority-critical'][priority] ?? '';
  }

  columnClass(status: TicketStatus): string {
    return ['col-open', 'col-inprogress', 'col-resolved', 'col-closed'][status] ?? '';
  }

  onSearch(val: string): void { this.searchTerm.set(val); }
  onPriorityChange(val: string): void { this.priorityFilter.set(val); }
}
