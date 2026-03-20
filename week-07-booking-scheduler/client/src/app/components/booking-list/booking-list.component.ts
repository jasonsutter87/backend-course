import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Booking } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.css'
})
export class BookingListComponent implements OnInit {
  private readonly bookingService = inject(BookingService);

  bookings: Booking[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getAll().subscribe({
      next: (bookings) => {
        this.bookings = bookings.sort(
          (a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
        );
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load bookings.';
        this.loading = false;
      }
    });
  }

  cancelBooking(id: number): void {
    if (confirm('Cancel this booking? The time slot will become available again.')) {
      this.bookingService.delete(id).subscribe({
        next: () => {
          this.bookings = this.bookings.filter(b => b.id !== id);
        },
        error: () => {
          this.error = 'Failed to cancel booking.';
        }
      });
    }
  }

  formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString([], {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
