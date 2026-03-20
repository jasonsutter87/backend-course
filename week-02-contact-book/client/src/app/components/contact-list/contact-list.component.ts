import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  searchQuery = '';
  loading = false;
  searching = false;
  error: string | null = null;

  constructor(
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.loading = true;
    this.error = null;
    this.contactService.getAll().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load contacts. Is the backend running?';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      this.loadContacts();
      return;
    }

    this.searching = true;
    this.error = null;
    this.contactService.search(query).subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.searching = false;
      },
      error: (err) => {
        this.error = 'Search failed. Please try again.';
        this.searching = false;
        console.error(err);
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.loadContacts();
  }

  fullName(contact: Contact): string {
    return `${contact.firstName} ${contact.lastName}`;
  }

  navigateToAdd(): void {
    this.router.navigate(['/add']);
  }

  editContact(contact: Contact): void {
    this.router.navigate(['/edit', contact.id]);
  }

  deleteContact(contact: Contact): void {
    if (!confirm(`Delete ${this.fullName(contact)}?`)) return;

    this.contactService.delete(contact.id).subscribe({
      next: () => {
        this.contacts = this.contacts.filter(c => c.id !== contact.id);
      },
      error: (err) => {
        console.error('Failed to delete contact', err);
      }
    });
  }
}
