import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgFor, NgIf],
  templateUrl: './department-form.component.html',
  styleUrl: './department-form.component.css'
})
export class DepartmentFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    parentDepartmentId: [null]
  });

  allDepartments = signal<Department[]>([]);
  isEditMode = signal(false);
  departmentId = signal<number | null>(null);
  loading = signal(false);
  submitting = signal(false);
  error = signal('');

  availableParents = signal<Department[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.departmentId.set(+id);
      this.loadDepartment(+id);
    }
    this.loadAllDepartments();
  }

  loadAllDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.allDepartments.set(data);
        // Exclude current department from parent options to prevent circular refs
        const currentId = this.departmentId();
        this.availableParents.set(currentId ? data.filter(d => d.id !== currentId) : data);
      },
      error: () => this.error.set('Failed to load departments.')
    });
  }

  loadDepartment(id: number): void {
    this.loading.set(true);
    this.departmentService.getById(id).subscribe({
      next: (dept) => {
        this.form.patchValue({
          name: dept.name,
          parentDepartmentId: dept.parentDepartmentId ?? null
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load department.');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const rawParent = this.form.value.parentDepartmentId;
    const value = {
      name: this.form.value.name,
      parentDepartmentId: rawParent ? +rawParent : null
    };

    if (this.isEditMode() && this.departmentId()) {
      this.departmentService.update(this.departmentId()!, value).subscribe({
        next: () => this.router.navigate(['/departments']),
        error: () => {
          this.error.set('Failed to update department.');
          this.submitting.set(false);
        }
      });
    } else {
      this.departmentService.create(value).subscribe({
        next: () => this.router.navigate(['/departments']),
        error: () => {
          this.error.set('Failed to create department.');
          this.submitting.set(false);
        }
      });
    }
  }

  fieldError(name: string): boolean {
    const ctrl = this.form.get(name);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
