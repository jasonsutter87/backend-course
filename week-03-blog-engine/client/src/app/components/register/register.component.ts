import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  submitting = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get usernameControl(): FormControl { return this.form.get('username') as FormControl; }
  get emailControl(): FormControl { return this.form.get('email') as FormControl; }
  get passwordControl(): FormControl { return this.form.get('password') as FormControl; }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;

    this.submitting = true;
    this.error = null;

    this.authService.register({
      username: this.form.value.username!,
      email: this.form.value.email!,
      passwordHash: this.form.value.password!,
      role: 'reader'
    }).subscribe({
      next: () => {
        this.success = 'Account created! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error = 'Registration failed. Please try again.';
        this.submitting = false;
        console.error(err);
      }
    });
  }
}
