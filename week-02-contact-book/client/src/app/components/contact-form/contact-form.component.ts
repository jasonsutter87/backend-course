import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent implements OnInit {
  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('')
  });

  editId: number | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editId = parseInt(idParam, 10);
      this.loadContact(this.editId);
    }
  }

  get isEditMode(): boolean {
    return this.editId !== null;
  }

  get firstNameControl(): FormControl {
    return this.form.get('firstName') as FormControl;
  }

  get lastNameControl(): FormControl {
    return this.form.get('lastName') as FormControl;
  }

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  loadContact(id: number): void {
    this.loading = true;
    this.contactService.getById(id).subscribe({
      next: (contact: Contact) => {
        this.form.patchValue({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load contact.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;

    this.submitting = true;
    this.error = null;

    const payload = {
      firstName: this.form.value.firstName!.trim(),
      lastName: this.form.value.lastName!.trim(),
      email: this.form.value.email!.trim(),
      phone: (this.form.value.phone || '').trim()
    };

    if (this.isEditMode && this.editId !== null) {
      this.contactService.update(this.editId, payload).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          this.error = 'Failed to update contact. Please try again.';
          this.submitting = false;
          console.error(err);
        }
      });
    } else {
      this.contactService.create(payload).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          this.error = 'Failed to create contact. Please try again.';
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
