import { Department } from './department.model';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  departmentId: number;
  department?: Department;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  departmentId: number;
}
