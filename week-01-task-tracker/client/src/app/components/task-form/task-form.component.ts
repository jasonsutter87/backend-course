import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { TaskItem } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl('')
  });

  editId: number | null = null;
  existingTask: TaskItem | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editId = parseInt(idParam, 10);
      this.loadTask(this.editId);
    }
  }

  get isEditMode(): boolean {
    return this.editId !== null;
  }

  get titleControl(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }

  loadTask(id: number): void {
    this.loading = true;
    this.taskService.getById(id).subscribe({
      next: (task) => {
        this.existingTask = task;
        this.form.patchValue({
          title: task.title,
          description: task.description
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load task.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;

    this.submitting = true;
    this.error = null;

    const title = this.form.value.title!.trim();
    const description = (this.form.value.description || '').trim();

    if (this.isEditMode && this.editId !== null && this.existingTask) {
      this.taskService.update(this.editId, {
        title,
        description,
        isComplete: this.existingTask.isComplete
      }).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          this.error = 'Failed to update task. Please try again.';
          this.submitting = false;
          console.error(err);
        }
      });
    } else {
      this.taskService.create({ title, description }).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          this.error = 'Failed to create task. Please try again.';
          this.submitting = false;
          console.error(err);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
