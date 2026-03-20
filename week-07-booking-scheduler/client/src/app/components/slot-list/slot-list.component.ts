import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TimeSlot } from '../../models/time-slot.model';
import { SlotService } from '../../services/slot.service';

@Component({
  selector: 'app-slot-list',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './slot-list.component.html',
  styleUrl: './slot-list.component.css'
})
export class SlotListComponent implements OnInit {
  private readonly slotService = inject(SlotService);
  private readonly router = inject(Router);

  slots: TimeSlot[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadSlots();
  }

  loadSlots(): void {
    this.slotService.getAll().subscribe({
      next: (slots) => {
        this.slots = slots.sort(
          (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load time slots. Is the server running?';
        this.loading = false;
      }
    });
  }

  bookSlot(slot: TimeSlot): void {
    if (slot.isAvailable) {
      this.router.navigate(['/book', slot.id]);
    }
  }

  deleteSlot(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Delete this time slot?')) {
      this.slotService.delete(id).subscribe({
        next: () => {
          this.slots = this.slots.filter(s => s.id !== id);
        }
      });
    }
  }

  get availableCount(): number {
    return this.slots.filter(s => s.isAvailable).length;
  }

  get bookedCount(): number {
    return this.slots.filter(s => !s.isAvailable).length;
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }
}
