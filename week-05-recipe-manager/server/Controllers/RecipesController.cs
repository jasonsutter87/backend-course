using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeManager.Data;
using RecipeManager.Models;

namespace RecipeManager.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipesController : ControllerBase
{
    private readonly AppDbContext _db;

    public RecipesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var recipes = await _db.Recipes
            .Include(r => r.RecipeTags)
            .ThenInclude(rt => rt.Tag)
            .ToListAsync();
        return Ok(recipes);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var recipe = await _db.Recipes
            .Include(r => r.RecipeTags)
            .ThenInclude(rt => rt.Tag)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (recipe is null) return NotFound();
        return Ok(recipe);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Recipe recipe)
    {
        _db.Recipes.Add(recipe);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = recipe.Id }, recipe);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Recipe recipe)
    {
        if (id != recipe.Id) return BadRequest();

        _db.Entry(recipe).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var recipe = await _db.Recipes.FindAsync(id);
        if (recipe is null) return NotFound();

        _db.Recipes.Remove(recipe);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
