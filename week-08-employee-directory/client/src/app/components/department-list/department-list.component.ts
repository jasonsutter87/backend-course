import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';

export interface DepartmentNode extends Department {
  depth: number;
  employeeCount: number;
}

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, NgClass],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css'
})
export class DepartmentListComponent implements OnInit {
  private readonly departmentService = inject(DepartmentService);

  departments = signal<Department[]>([]);
  loading = signal(true);
  error = signal('');

  flatTree = computed<DepartmentNode[]>(() => {
    return this.buildFlatTree(this.departments(), null, 0);
  });

  ngOnInit(): void {
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.departments.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load departments. Is the server running?');
        this.loading.set(false);
      }
    });
  }

  private buildFlatTree(all: Department[], parentId: number | null | undefined, depth: number): DepartmentNode[] {
    const nodes: DepartmentNode[] = [];
    const children = all.filter(d => (d.parentDepartmentId ?? null) === (parentId ?? null));
    for (const dept of children) {
      const employeeCount = dept.employees?.length ?? 0;
      nodes.push({ ...dept, depth, employeeCount });
      nodes.push(...this.buildFlatTree(all, dept.id, depth + 1));
    }
    return nodes;
  }

  deleteDepartment(id: number, name: string): void {
    if (!confirm(`Delete "${name}"? Employees in this department may be affected.`)) return;
    this.departmentService.delete(id).subscribe({
      next: () => this.departments.update(list => list.filter(d => d.id !== id)),
      error: () => alert('Failed to delete department.')
    });
  }

  getIndent(depth: number): string {
    return `${depth * 1.5}rem`;
  }
}
