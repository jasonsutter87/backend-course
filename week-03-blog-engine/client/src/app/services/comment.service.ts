import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:5000/api/comments';

  constructor(private http: HttpClient) {}

  getByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/post/${postId}`);
  }

  create(comment: { content: string; postId: number; authorId: number }): Observable<Comment> {
    return this.http.post<Comment>(this.baseUrl, comment);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
