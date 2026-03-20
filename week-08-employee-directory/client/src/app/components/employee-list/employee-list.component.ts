import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, NgIf],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  employees = signal<Employee[]>([]);
  searchTerm = signal('');
  loading = signal(true);
  error = signal('');

  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.employees();
    return this.employees().filter(e =>
      e.firstName.toLowerCase().includes(term) ||
      e.lastName.toLowerCase().includes(term) ||
      e.email.toLowerCase().includes(term) ||
      e.title.toLowerCase().includes(term) ||
      (e.department?.name ?? '').toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading.set(true);
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load employees. Is the server running?');
        this.loading.set(false);
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  deleteEmployee(id: number, name: string): void {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    this.employeeService.delete(id).subscribe({
      next: () => this.employees.update(list => list.filter(e => e.id !== id)),
      error: () => alert('Failed to delete employee.')
    });
  }
}
