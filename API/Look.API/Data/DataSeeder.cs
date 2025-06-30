using Look.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Look.API.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (!await context.Users.AnyAsync(u => u.Role == UserRole.Admin))
        {
            var adminUser = new User
            {
                FirstName = "Admin",
                LastName = "User",
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = UserRole.Admin
            };

            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
        }

        
    }
}
