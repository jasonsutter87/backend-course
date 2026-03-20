import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  comments: Comment[] = [];
  loading = false;
  error: string | null = null;
  submittingComment = false;
  commentError: string | null = null;
  deletingPostId: number | null = null;

  commentForm = new FormGroup({
    content: new FormControl('', [Validators.required, Validators.minLength(1)])
  });

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    this.loadPost(id);
  }

  loadPost(id: number): void {
    this.loading = true;
    this.error = null;
    this.postService.getById(id).subscribe({
      next: (post) => {
        this.post = post;
        this.comments = post.comments || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load post.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get contentControl(): FormControl {
    return this.commentForm.get('content') as FormControl;
  }

  submitComment(): void {
    if (this.commentForm.invalid || this.submittingComment || !this.post) return;

    const user = this.authService.getCurrentUser();
    const authorId = user?.id ?? 1; // Fallback to 1 for demo when auth is stubbed

    this.submittingComment = true;
    this.commentError = null;

    this.commentService.create({
      content: this.commentForm.value.content!.trim(),
      postId: this.post.id,
      authorId
    }).subscribe({
      next: (comment) => {
        this.comments = [...this.comments, comment];
        this.commentForm.reset();
        this.submittingComment = false;
      },
      error: (err) => {
        this.commentError = 'Failed to post comment. Please try again.';
        this.submittingComment = false;
        console.error(err);
      }
    });
  }

  deleteComment(comment: Comment): void {
    if (!confirm('Delete this comment?')) return;

    this.commentService.delete(comment.id).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== comment.id);
      },
      error: (err) => {
        console.error('Failed to delete comment', err);
      }
    });
  }

  deletePost(): void {
    if (!this.post || !confirm(`Delete "${this.post.title}"?`)) return;

    this.postService.delete(this.post.id).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        console.error('Failed to delete post', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
