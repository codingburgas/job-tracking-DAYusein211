using System.ComponentModel.DataAnnotations;

namespace Look.API.Models;

public class User
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string? MiddleName { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    [Required]
    public UserRole Role { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<Application> Applications { get; set; } = new List<Application>();
}

public enum UserRole
{
    User = 0,
    Admin = 1
}