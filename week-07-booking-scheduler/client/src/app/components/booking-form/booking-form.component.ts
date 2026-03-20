import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SlotService } from '../../services/slot.service';
import { BookingService } from '../../services/booking.service';
import { TimeSlot } from '../../models/time-slot.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly slotService = inject(SlotService);
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form!: FormGroup;
  slot: TimeSlot | null = null;
  loading = true;
  submitting = false;
  error = '';

  ngOnInit(): void {
    const slotId = Number(this.route.snapshot.paramMap.get('slotId'));

    this.form = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerEmail: ['', [Validators.required, Validators.email]]
    });

    this.slotService.getById(slotId).subscribe({
      next: (slot) => {
        if (!slot.isAvailable) {
          this.error = 'This time slot is no longer available.';
        }
        this.slot = slot;
        this.loading = false;
      },
      error: () => {
        this.error = 'Time slot not found.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.slot) return;
    this.submitting = true;
    this.error = '';

    const { customerName, customerEmail } = this.form.value;
    this.bookingService.create({
      timeSlotId: this.slot.id,
      customerName,
      customerEmail
    }).subscribe({
      next: () => this.router.navigate(['/bookings']),
      error: (err) => {
        this.error = err.status === 409
          ? 'This slot was just booked by someone else.'
          : 'Failed to create booking. Please try again.';
        this.submitting = false;
      }
    });
  }

  formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString([], {
      weekday: 'long', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  get f() {
    return this.form.controls;
  }
}
