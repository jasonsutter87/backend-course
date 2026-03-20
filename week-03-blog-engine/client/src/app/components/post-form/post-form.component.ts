import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent implements OnInit {
  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(1)]),
    content: new FormControl('', [Validators.required, Validators.minLength(1)])
  });

  editId: number | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;

  constructor(
    private postService: PostService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if this is an edit route by looking for :id but not matching 'new'
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.editId = parseInt(idParam, 10);
      this.loadPost(this.editId);
    }
  }

  get isEditMode(): boolean {
    return this.editId !== null;
  }

  get titleControl(): FormControl { return this.form.get('title') as FormControl; }
  get contentControl(): FormControl { return this.form.get('content') as FormControl; }

  loadPost(id: number): void {
    this.loading = true;
    this.postService.getById(id).subscribe({
      next: (post: Post) => {
        this.form.patchValue({ title: post.title, content: post.content });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load post.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;

    this.submitting = true;
    this.error = null;

    const title = this.form.value.title!.trim();
    const content = this.form.value.content!.trim();

    if (this.isEditMode && this.editId !== null) {
      this.postService.update(this.editId, { title, content }).subscribe({
        next: (post) => this.router.navigate(['/posts', post.id]),
        error: (err) => {
          this.error = 'Failed to update post. Please try again.';
          this.submitting = false;
          console.error(err);
        }
      });
    } else {
      const user = this.authService.getCurrentUser();
      const authorId = user?.id ?? 1;

      this.postService.create({ title, content, authorId }).subscribe({
        next: (post) => this.router.navigate(['/posts', post.id]),
        error: (err) => {
          this.error = 'Failed to create post. Please try again.';
          this.submitting = false;
          console.error(err);
        }
      });
    }
  }

  cancel(): void {
    if (this.isEditMode && this.editId) {
      this.router.navigate(['/posts', this.editId]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
