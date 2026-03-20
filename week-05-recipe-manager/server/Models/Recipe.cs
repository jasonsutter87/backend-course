namespace RecipeManager.Models;

public class Recipe
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;

    public ICollection<RecipeTag> RecipeTags { get; set; } = new List<RecipeTag>();
}
