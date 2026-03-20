import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SlotService } from '../../services/slot.service';

@Component({
  selector: 'app-slot-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './slot-form.component.html',
  styleUrl: './slot-form.component.css'
})
export class SlotFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly slotService = inject(SlotService);
  private readonly router = inject(Router);

  form!: FormGroup;
  submitting = false;
  error = '';

  ngOnInit(): void {
    // Default: next hour, rounded
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
    const later = new Date(now);
    later.setHours(later.getHours() + 1);

    this.form = this.fb.group({
      startTime: [this.toDatetimeLocal(now), Validators.required],
      endTime: [this.toDatetimeLocal(later), Validators.required]
    }, { validators: this.timeRangeValidator });
  }

  toDatetimeLocal(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  timeRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
    const start = group.get('startTime')?.value;
    const end = group.get('endTime')?.value;
    if (start && end && new Date(end) <= new Date(start)) {
      return { invalidRange: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.error = '';

    const { startTime, endTime } = this.form.value;
    this.slotService.create({
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString()
    }).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.error = 'Failed to create time slot.';
        this.submitting = false;
      }
    });
  }

  get f() {
    return this.form.controls;
  }
}
