import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { TagService } from '../../services/tag.service';
import { Recipe, Tag } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit {
  private readonly recipeService = inject(RecipeService);
  private readonly tagService = inject(TagService);

  recipes = signal<Recipe[]>([]);
  tags = signal<Tag[]>([]);
  searchQuery = signal('');
  selectedTagId = signal<number | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  filteredRecipes = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const tagId = this.selectedTagId();
    return this.recipes().filter(r => {
      const matchesSearch = !query || r.name.toLowerCase().includes(query) || r.description.toLowerCase().includes(query);
      const matchesTag = tagId == null || r.recipeTags.some(rt => rt.tagId === tagId);
      return matchesSearch && matchesTag;
    });
  });

  ngOnInit(): void {
    this.loading.set(true);
    this.recipeService.getAll().subscribe({
      next: data => {
        this.recipes.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load recipes.');
        this.loading.set(false);
      }
    });

    this.tagService.getAll().subscribe({
      next: data => this.tags.set(data),
      error: () => {}
    });
  }

  deleteRecipe(id: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm('Delete this recipe?')) return;
    this.recipeService.delete(id).subscribe({
      next: () => this.recipes.update(list => list.filter(r => r.id !== id)),
      error: () => this.error.set('Failed to delete recipe.')
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
}
