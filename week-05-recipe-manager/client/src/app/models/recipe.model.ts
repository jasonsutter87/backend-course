export interface Tag {
  id: number;
  name: string;
}

export interface RecipeTag {
  recipeId: number;
  tagId: number;
  tag: Tag;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  recipeTags: RecipeTag[];
}

export interface CreateRecipe {
  name: string;
  description: string;
  imageUrl: string;
  difficulty: string;
  recipeTags: { tagId: number }[];
}
