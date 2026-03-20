export interface Department {
  id: number;
  name: string;
  parentDepartmentId?: number | null;
  parentDepartment?: Department | null;
  subDepartments?: Department[];
  employees?: import('./employee.model').Employee[];
}

export interface CreateDepartmentDto {
  name: string;
  parentDepartmentId?: number | null;
}
