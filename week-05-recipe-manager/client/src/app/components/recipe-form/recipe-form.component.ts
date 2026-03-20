import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { RecipeService } from '../../services/recipe.service';
import { TagService } from '../../services/tag.service';
import { Tag } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.css'
})
export class RecipeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly recipeService = inject(RecipeService);
  private readonly tagService = inject(TagService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  tags = signal<Tag[]>([]);
  selectedTagIds = signal<Set<number>>(new Set());
  isEditMode = signal(false);
  editId = signal<number | null>(null);
  submitting = signal(false);
  error = signal<string | null>(null);

  readonly difficulties = ['Easy', 'Medium', 'Hard'];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', Validators.required],
    imageUrl: [''],
    difficulty: ['Easy', Validators.required]
  });

  ngOnInit(): void {
    this.tagService.getAll().subscribe({
      next: tags => this.tags.set(tags),
      error: () => {}
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.editId.set(+id);
      this.recipeService.getById(+id).subscribe({
        next: recipe => {
          this.form.patchValue({
            name: recipe.name,
            description: recipe.description,
            imageUrl: recipe.imageUrl,
            difficulty: recipe.difficulty
          });
          this.selectedTagIds.set(new Set(recipe.recipeTags.map(rt => rt.tagId)));
        },
        error: () => this.error.set('Failed to load recipe.')
      });
    }
  }

  toggleTag(tagId: number): void {
    this.selectedTagIds.update(set => {
      const next = new Set(set);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  }

  isTagSelected(tagId: number): boolean {
    return this.selectedTagIds().has(tagId);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const payload = {
      name: v.name!,
      description: v.description!,
      imageUrl: v.imageUrl || '',
      difficulty: v.difficulty!,
      recipeTags: Array.from(this.selectedTagIds()).map(tagId => ({ tagId }))
    };

    this.submitting.set(true);
    this.error.set(null);

    const request$ = this.isEditMode()
      ? this.recipeService.update(this.editId()!, payload)
      : this.recipeService.create(payload) as Observable<any>;

    (request$ as Observable<any>).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.error.set('Failed to save recipe. Please try again.');
        this.submitting.set(false);
      }
    });
  }

  get f() { return this.form.controls; }
}
