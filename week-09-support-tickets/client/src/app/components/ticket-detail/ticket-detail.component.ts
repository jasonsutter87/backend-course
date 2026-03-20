import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgClass, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket, TicketStatus, Priority, STATUS_LABELS, PRIORITY_LABELS } from '../../models/ticket.model';

interface StatusTransition {
  label: string;
  targetStatus: TicketStatus;
  cssClass: string;
}

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass, DatePipe, FormsModule],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ticket = signal<Ticket | null>(null);
  loading = signal(true);
  error = signal('');
  saving = signal(false);
  assignInput = signal('');
  showAssignField = signal(false);

  readonly STATUS_LABELS = STATUS_LABELS;
  readonly PRIORITY_LABELS = PRIORITY_LABELS;
  readonly TicketStatus = TicketStatus;
  readonly Priority = Priority;

  ngOnInit(): void {
    const id = +(this.route.snapshot.paramMap.get('id') ?? '0');
    this.ticketService.getById(id).subscribe({
      next: (t) => { this.ticket.set(t); this.assignInput.set(t.assignedTo ?? ''); this.loading.set(false); },
      error: () => { this.error.set('Ticket not found.'); this.loading.set(false); }
    });
  }

  get statusTransitions(): StatusTransition[] {
    const t = this.ticket();
    if (!t) return [];
    switch (t.status) {
      case TicketStatus.Open:
        return [{ label: 'Start Progress', targetStatus: TicketStatus.InProgress, cssClass: 'btn-progress' }];
      case TicketStatus.InProgress:
        return [
          { label: 'Mark Resolved', targetStatus: TicketStatus.Resolved, cssClass: 'btn-resolve' },
          { label: 'Reopen', targetStatus: TicketStatus.Open, cssClass: 'btn-reopen' }
        ];
      case TicketStatus.Resolved:
        return [
          { label: 'Close Ticket', targetStatus: TicketStatus.Closed, cssClass: 'btn-close-ticket' },
          { label: 'Reopen', targetStatus: TicketStatus.Open, cssClass: 'btn-reopen' }
        ];
      case TicketStatus.Closed:
        return [{ label: 'Reopen', targetStatus: TicketStatus.Open, cssClass: 'btn-reopen' }];
      default:
        return [];
    }
  }

  applyStatus(targetStatus: TicketStatus): void {
    const t = this.ticket();
    if (!t) return;
    this.saving.set(true);
    this.ticketService.updateStatus(t.id, targetStatus).subscribe({
      next: (updated) => { this.ticket.set(updated); this.saving.set(false); },
      error: () => { alert('Failed to update status.'); this.saving.set(false); }
    });
  }

  saveAssignment(): void {
    const t = this.ticket();
    if (!t) return;
    this.saving.set(true);
    this.ticketService.assign(t.id, this.assignInput()).subscribe({
      next: (updated) => {
        this.ticket.set(updated);
        this.showAssignField.set(false);
        this.saving.set(false);
      },
      error: () => { alert('Failed to assign ticket.'); this.saving.set(false); }
    });
  }

  deleteTicket(): void {
    const t = this.ticket();
    if (!t || !confirm('Delete this ticket? This cannot be undone.')) return;
    this.ticketService.delete(t.id).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => alert('Failed to delete ticket.')
    });
  }

  priorityClass(p: Priority): string {
    return ['priority-low', 'priority-medium', 'priority-high', 'priority-critical'][p] ?? '';
  }

  statusClass(s: TicketStatus): string {
    return ['status-open', 'status-inprogress', 'status-resolved', 'status-closed'][s] ?? '';
  }
}
