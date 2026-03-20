import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class TagService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5000/api/tags';

  getAll(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.baseUrl);
  }

  create(tag: { name: string }): Observable<Tag> {
    return this.http.post<Tag>(this.baseUrl, tag);
  }
}
