import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private postService: PostService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;
    this.postService.getAll().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load posts. Is the backend running?';
        this.loading = false;
        console.error(err);
      }
    });
  }

  excerpt(content: string): string {
    return content.length > 150 ? content.slice(0, 150) + '...' : content;
  }

  viewPost(post: Post): void {
    this.router.navigate(['/posts', post.id]);
  }

  logout(): void {
    this.authService.logout();
  }
}
