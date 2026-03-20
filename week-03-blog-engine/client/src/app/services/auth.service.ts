import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface RegisterPayload {
  username: string;
  email: string;
  passwordHash: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface StoredUser {
  id?: number;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';
  private readonly storageKey = 'blog_user';

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  login(credentials: LoginPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Server returns a stub message for now — store minimal info
        const user: StoredUser = {
          username: credentials.email,
          email: credentials.email,
          role: 'reader'
        };
        this.setCurrentUser(user);
      })
    );
  }

  getCurrentUser(): StoredUser | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return null;
    }
  }

  setCurrentUser(user: StoredUser): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}
