import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { TaskItem } from '../../models/task.model';

type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: TaskItem[] = [];
  activeFilter: FilterType = 'all';
  loading = false;
  error: string | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = null;
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tasks. Is the backend running?';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get filteredTasks(): TaskItem[] {
    switch (this.activeFilter) {
      case 'active':
        return this.tasks.filter(t => !t.isComplete);
      case 'completed':
        return this.tasks.filter(t => t.isComplete);
      default:
        return this.tasks;
    }
  }

  get activeCount(): number {
    return this.tasks.filter(t => !t.isComplete).length;
  }

  get completedCount(): number {
    return this.tasks.filter(t => t.isComplete).length;
  }

  setFilter(filter: FilterType): void {
    this.activeFilter = filter;
  }

  toggleComplete(task: TaskItem): void {
    this.taskService.update(task.id, {
      title: task.title,
      description: task.description,
      isComplete: !task.isComplete
    }).subscribe({
      next: (updated) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updated;
        }
      },
      error: (err) => {
        console.error('Failed to update task', err);
      }
    });
  }

  deleteTask(task: TaskItem): void {
    if (!confirm(`Delete "${task.title}"?`)) return;

    this.taskService.delete(task.id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
      },
      error: (err) => {
        console.error('Failed to delete task', err);
      }
    });
  }

  editTask(task: TaskItem): void {
    this.router.navigate(['/edit', task.id]);
  }

  navigateToAdd(): void {
    this.router.navigate(['/add']);
  }
}
