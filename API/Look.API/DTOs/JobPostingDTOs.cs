using System.ComponentModel.DataAnnotations;
using Look.API.Models;

namespace Look.API.DTOs;

public class JobPostingDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DatePosted { get; set; }
    public JobStatus Status { get; set; }
    public string? JobType { get; set; }
    public string? Location { get; set; }
    public string? SalaryRange { get; set; }
    public string? ExperienceLevel { get; set; }
    public int ApplicationsCount { get; set; }
}

public class CreateJobPostingDTO
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string CompanyName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string? JobType { get; set; }
    
    [MaxLength(100)]
    public string? Location { get; set; }
    
    [MaxLength(50)]
    public string? SalaryRange { get; set; }
    
    [MaxLength(50)]
    public string? ExperienceLevel { get; set; }
}

public class UpdateJobPostingDTO : CreateJobPostingDTO
{
    public JobStatus Status { get; set; }
}