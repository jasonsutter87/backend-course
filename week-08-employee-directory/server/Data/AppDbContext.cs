using Microsoft.EntityFrameworkCore;
using EmployeeDirectory.Models;

namespace EmployeeDirectory.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Employee> Employees => Set<Employee>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Department>()
            .HasOne(d => d.ParentDepartment)
            .WithMany(d => d.SubDepartments)
            .HasForeignKey(d => d.ParentDepartmentId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Department)
            .WithMany(d => d.Employees)
            .HasForeignKey(e => e.DepartmentId);

        // Indexes
        modelBuilder.Entity<Employee>()
            .HasIndex(e => e.Email)
            .IsUnique();

        modelBuilder.Entity<Employee>()
            .HasIndex(e => e.DepartmentId);

        modelBuilder.Entity<Employee>()
            .HasIndex(e => new { e.LastName, e.FirstName });

        modelBuilder.Entity<Department>()
            .HasIndex(d => d.ParentDepartmentId);

        // Seed data
        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "Engineering", ParentDepartmentId = null },
            new Department { Id = 2, Name = "Marketing", ParentDepartmentId = null },
            new Department { Id = 3, Name = "Sales", ParentDepartmentId = null },
            new Department { Id = 4, Name = "Frontend", ParentDepartmentId = 1 },
            new Department { Id = 5, Name = "Backend", ParentDepartmentId = 1 }
        );

        modelBuilder.Entity<Employee>().HasData(
            new Employee { Id = 1, FirstName = "Alex", LastName = "Rivera", Email = "alex.rivera@example.com", Title = "Senior Engineer", DepartmentId = 4 },
            new Employee { Id = 2, FirstName = "Jordan", LastName = "Kim", Email = "jordan.kim@example.com", Title = "Backend Engineer", DepartmentId = 5 },
            new Employee { Id = 3, FirstName = "Sam", LastName = "Patel", Email = "sam.patel@example.com", Title = "Marketing Manager", DepartmentId = 2 },
            new Employee { Id = 4, FirstName = "Morgan", LastName = "Chen", Email = "morgan.chen@example.com", Title = "Account Executive", DepartmentId = 3 }
        );
    }
}
