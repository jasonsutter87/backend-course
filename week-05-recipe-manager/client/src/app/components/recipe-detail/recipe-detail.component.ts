import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe, Tag } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent implements OnInit {
  private readonly recipeService = inject(RecipeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  recipe = signal<Recipe | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return;
    }
    this.recipeService.getById(+id).subscribe({
      next: data => {
        this.recipe.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Recipe not found.');
        this.loading.set(false);
      }
    });
  }

  recipeTags(recipe: Recipe): Tag[] {
    return recipe.recipeTags.map(rt => rt.tag).filter(Boolean);
  }

  difficultyClass(difficulty: string): string {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'badge-easy';
      case 'medium': return 'badge-medium';
      case 'hard': return 'badge-hard';
      default: return 'badge-medium';
    }
  }

  deleteRecipe(): void {
    const r = this.recipe();
    if (!r || !confirm('Are you sure you want to delete this recipe?')) return;
    this.recipeService.delete(r.id).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.error.set('Failed to delete recipe.')
    });
  }
}
