using System.ComponentModel.DataAnnotations;

namespace Look.API.Models;

public class JobPosting
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string CompanyName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    public DateTime DatePosted { get; set; } = DateTime.UtcNow;
    
    public JobStatus Status { get; set; } = JobStatus.Active;
    
    [MaxLength(50)]
    public string? JobType { get; set; }
    
    [MaxLength(100)]
    public string? Location { get; set; }
    
    [MaxLength(50)]
    public string? SalaryRange { get; set; }
    
    [MaxLength(50)]
    public string? ExperienceLevel { get; set; }
    
    public ICollection<Application> Applications { get; set; } = new List<Application>();
}

public enum JobStatus
{
    Active = 0,
    Inactive = 1
}