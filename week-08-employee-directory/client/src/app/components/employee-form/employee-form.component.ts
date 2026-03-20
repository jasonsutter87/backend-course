import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgFor, NgIf],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    title: ['', Validators.required],
    departmentId: [null, Validators.required]
  });

  departments = signal<Department[]>([]);
  isEditMode = signal(false);
  employeeId = signal<number | null>(null);
  loading = signal(false);
  submitting = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.employeeId.set(+id);
      this.loadEmployee(+id);
    }
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (data) => this.departments.set(data),
      error: () => this.error.set('Failed to load departments.')
    });
  }

  loadEmployee(id: number): void {
    this.loading.set(true);
    this.employeeService.getById(id).subscribe({
      next: (emp) => {
        this.form.patchValue({
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          title: emp.title,
          departmentId: emp.departmentId
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load employee.');
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
    const value = { ...this.form.value, departmentId: +this.form.value.departmentId };

    if (this.isEditMode() && this.employeeId()) {
      this.employeeService.update(this.employeeId()!, value).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => {
          this.error.set('Failed to update employee.');
          this.submitting.set(false);
        }
      });
    } else {
      this.employeeService.create(value).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => {
          this.error.set('Failed to create employee.');
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
