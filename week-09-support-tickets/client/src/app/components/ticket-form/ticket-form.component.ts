import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { TicketStatus, Priority } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './ticket-form.component.html',
  styleUrl: './ticket-form.component.css'
})
export class TicketFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ticketService = inject(TicketService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    priority: [Priority.Medium, Validators.required],
    status: [TicketStatus.Open, Validators.required],
    assignedTo: ['']
  });

  isEditMode = signal(false);
  ticketId = signal<number | null>(null);
  loading = signal(false);
  submitting = signal(false);
  error = signal('');

  readonly priorities = [
    { value: Priority.Low, label: 'Low' },
    { value: Priority.Medium, label: 'Medium' },
    { value: Priority.High, label: 'High' },
    { value: Priority.Critical, label: 'Critical' }
  ];

  readonly statuses = [
    { value: TicketStatus.Open, label: 'Open' },
    { value: TicketStatus.InProgress, label: 'In Progress' },
    { value: TicketStatus.Resolved, label: 'Resolved' },
    { value: TicketStatus.Closed, label: 'Closed' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.ticketId.set(+id);
      this.loading.set(true);
      this.ticketService.getById(+id).subscribe({
        next: (t) => {
          this.form.patchValue({
            title: t.title,
            description: t.description,
            priority: t.priority,
            status: t.status,
            assignedTo: t.assignedTo ?? ''
          });
          this.loading.set(false);
        },
        error: () => { this.error.set('Failed to load ticket.'); this.loading.set(false); }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const val = {
      ...this.form.value,
      priority: +this.form.value.priority,
      status: +this.form.value.status,
      assignedTo: this.form.value.assignedTo || null
    };

    if (this.isEditMode() && this.ticketId()) {
      this.ticketService.update(this.ticketId()!, val).subscribe({
        next: (t) => this.router.navigate(['/' + t.id]),
        error: () => { this.error.set('Failed to update ticket.'); this.submitting.set(false); }
      });
    } else {
      this.ticketService.create(val).subscribe({
        next: (t) => this.router.navigate(['/' + t.id]),
        error: () => { this.error.set('Failed to create ticket.'); this.submitting.set(false); }
      });
    }
  }

  fieldError(name: string): boolean {
    const c = this.form.get(name);
    return !!(c?.invalid && c?.touched);
  }
}
