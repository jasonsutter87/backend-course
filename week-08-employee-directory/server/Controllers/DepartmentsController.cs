using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeDirectory.Data;
using EmployeeDirectory.Models;

namespace EmployeeDirectory.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public DepartmentsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var departments = await _db.Departments
            .Include(d => d.ParentDepartment)
            .ToListAsync();
        return Ok(departments);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var department = await _db.Departments
            .Include(d => d.ParentDepartment)
            .Include(d => d.SubDepartments)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (department is null) return NotFound();
        return Ok(department);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Department department)
    {
        _db.Departments.Add(department);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = department.Id }, department);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Department department)
    {
        if (id != department.Id) return BadRequest();

        _db.Entry(department).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var department = await _db.Departments.FindAsync(id);
        if (department is null) return NotFound();

        _db.Departments.Remove(department);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
